from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already registered")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        username = attrs.get('username') or attrs.get('email')
        password = attrs.get('password')

        if not username or not password:
            raise serializers.ValidationError('Username/email and password are required.')

        user = None
        if attrs.get('username'):
            user = authenticate(username=attrs.get('username'), password=password)
        elif attrs.get('email'):
            try:
                user_obj = User.objects.get(email=attrs.get('email'))
            except User.DoesNotExist:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
            user = authenticate(username=user_obj.username, password=password)

        if not user:
            raise serializers.ValidationError('Unable to log in with provided credentials.')

        token, _ = Token.objects.get_or_create(user=user)
        attrs['user'] = user
        attrs['token'] = token.key
        return attrs


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
