package backend.back_temp_chat.service.IService;

import java.util.Optional;

import backend.back_temp_chat.entity.User;

public interface IUserService {
    User registerUser(User user);

    Optional<User> findByUsername(String username);

    Optional<User> findById(String userId);
}
