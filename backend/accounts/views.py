from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RegisterSerializer, UserSerializer


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
