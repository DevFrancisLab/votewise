from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import re

from .serializers import RegisterSerializer, UserSerializer
from langgraph_engine.graph import app
from langgraph_engine.state import LangGraphState


class RegisterAPIView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		serializer = RegisterSerializer(data=request.data)
		if serializer.is_valid():
			user = serializer.save()
			token, _ = Token.objects.get_or_create(user=user)
			return Response({'token': token.key, 'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		serializer = RegisterSerializer(data=request.data)
		# not used; use LoginSerializer to validate credentials
		from .serializers import LoginSerializer

		login_serializer = LoginSerializer(data=request.data)
		if not login_serializer.is_valid():
			return Response(login_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

		user = login_serializer.validated_data['user']
		token = login_serializer.validated_data['token']
		return Response({'token': token, 'user': UserSerializer(user).data})


class LogoutAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		try:
			request.user.auth_token.delete()
		except Exception:
			pass
		return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)


class UserDetailAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		serializer = UserSerializer(request.user)
		return Response(serializer.data)


class AIQueryAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		question = request.data.get("question")
		if not question or not isinstance(question, str):
			return Response(
				{"detail": "question field is required and must be a string"},
				status=status.HTTP_400_BAD_REQUEST,
			)

		# Provide a greeting response when question starts with a greeting
		re_greeting = re.compile(r'^(?P<greet>hi|hello|hey|good morning|good afternoon|good evening)[!.,]?\s*(?P<rest>.*)$', re.IGNORECASE)
		m = re_greeting.match(question.strip())
		greeting_response = None
		if m:
			greeting_response = (
				"Hello! Welcome to OneTM AI, your Kenyan civic assistant. "
				"I provide verified election information for Kenyan candidates, constituencies, wards, and voting processes. "
				"I do not fabricate data, and I only answer questions about Kenyan elections and voting."
			)

			extra = m.group("rest").strip()
			if not extra:
				return Response({"answer": greeting_response})

			# continue with the remaining question after greeting
			question = extra

		try:
			# Create LangGraphState object
			state = LangGraphState(user_question=question, next_agent="candidate_agent")
			state.add_message("user", question)

			# Invoke the LangGraph app
			result = app.invoke(state)

			# Extract final_answer from result
			final_answer = result.final_answer if hasattr(result, "final_answer") else result.get("final_answer", "")

			if greeting_response:
				final_answer = f"{greeting_response}\n\n{final_answer}"
			return Response({"answer": final_answer})
		except Exception as e:
			import traceback
			traceback.print_exc()
			return Response(
				{"detail": f"Error processing query: {str(e)}"},
				status=status.HTTP_500_INTERNAL_SERVER_ERROR,
			)
