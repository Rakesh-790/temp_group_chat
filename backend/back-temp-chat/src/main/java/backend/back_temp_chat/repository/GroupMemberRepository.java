package backend.back_temp_chat.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.back_temp_chat.entity.GroupMember;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, String> {
    List<GroupMember> findByGroupChat_GroupChatId(String groupChatId);
    List<GroupMember> findByUser_UserId(String userId);
    boolean existsByGroupChat_GroupChatIdAndUser_UserId(String groupChatId, String userId);
}
