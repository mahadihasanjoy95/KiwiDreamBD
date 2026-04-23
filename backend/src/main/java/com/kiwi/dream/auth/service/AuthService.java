package com.kiwi.dream.auth.service;

import com.kiwi.dream.auth.dto.request.*;
import com.kiwi.dream.auth.dto.response.ForgotPasswordResponseDto;
import com.kiwi.dream.auth.dto.response.TokenResponseDto;
import com.kiwi.dream.auth.dto.response.UserResponseDto;

public interface AuthService {
    UserResponseDto register(RegisterRequestDto requestDto);
    TokenResponseDto login(LoginRequestDto requestDto);
    TokenResponseDto refresh(RefreshTokenRequestDto requestDto);
    void logout(String refreshToken);
    UserResponseDto me(String userId);
    UserResponseDto updateMe(String userId, UpdateProfileRequestDto requestDto);
    void changePassword(String userId, ChangePasswordRequestDto requestDto);
    ForgotPasswordResponseDto forgotPassword(ForgotPasswordRequestDto requestDto);
    void resetPassword(ResetPasswordRequestDto requestDto);
}
