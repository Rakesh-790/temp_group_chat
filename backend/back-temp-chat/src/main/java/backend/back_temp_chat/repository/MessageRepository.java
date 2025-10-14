package backend.back_temp_chat.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.back_temp_chat.entity.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {
    List<Message> findByGroupChat_GroupChatIdOrderBySentAtAsc(String groupChatId);
}
