package backend.back_temp_chat.service.ServiceImpl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import backend.back_temp_chat.entity.User;
import backend.back_temp_chat.repository.UserRepository;
import backend.back_temp_chat.service.IService.IUserService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    private final UserRepository userRepository;

    @Override
    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> findById(String userId) {
        return userRepository.findById(userId);
    }
}
