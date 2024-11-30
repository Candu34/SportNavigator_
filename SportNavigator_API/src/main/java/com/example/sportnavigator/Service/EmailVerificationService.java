package com.example.sportnavigator.Service;


import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Repository.UserRepository;
import com.example.sportnavigator.Utils.Excetions.UserNotVerifiedException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final OtpService otpService;

    private final UserRepository userRepository;

    private final JavaMailSender mailSender;

    @Async
    public void sendVerificationToken(Long userId, String email) {
        final var token = otpService.generateAndStoreOtp(userId);

        final var emailVerificationUrl =
                "http://localhost:8080/api/auth/email/verify?uid=%s&t=%s"
                        .formatted(userId, token);
        final var emailText =
                "Click the link to verify your email: " + emailVerificationUrl;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Email Verification");
        message.setFrom("System");
        message.setText(emailText);

        mailSender.send(message);
    }

    public void resendVerificationToken(String email) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            throw new UserNotVerifiedException("User with this email does not exist");
        }

        User userFromDb = user.get();

        if (userFromDb.isEmailVerified()) {
            throw new ResponseStatusException(BAD_REQUEST,
                    "Email already verified");
        }


        sendVerificationToken(userFromDb.getId(), userFromDb.getEmail());
    }

    @Transactional
    public User verifyEmail(Long userId, String token) {
        if (!otpService.isOtpValid(userId, token)) {
            throw new ResponseStatusException(BAD_REQUEST,
                    "Token invalid or expired");
        }
        otpService.deleteOtp(userId);

        final var user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(GONE,
                                "User account has been deleted or deactivated"));

        if (user.isEmailVerified()) {
            throw new ResponseStatusException(BAD_REQUEST,
                    "Email is already verified");
        }

        user.setEmailVerified(true);

        return user;
    }


}
