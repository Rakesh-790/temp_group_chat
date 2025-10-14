package backend.back_temp_chat.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import backend.back_temp_chat.entity.GroupChat;
import jakarta.transaction.Transactional;

@Repository
public interface GroupChatRepository extends JpaRepository<GroupChat, String> {
    List<GroupChat> findByExpireAtAfter(Date now); // active groups
    List<GroupChat> findByExpireAtBefore(Date now); // expired groups

    @Transactional
    @Modifying
    @Query("DELETE FROM GroupChat g WHERE g.expireAt <= :currentTime")
    void deleteExpiredGroups(Date currentTime);
}