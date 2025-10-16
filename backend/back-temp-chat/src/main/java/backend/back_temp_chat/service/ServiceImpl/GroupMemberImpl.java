package backend.back_temp_chat.service.ServiceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import backend.back_temp_chat.entity.GroupMember;
import backend.back_temp_chat.repository.GroupMemberRepository;
import backend.back_temp_chat.service.IService.IGroupMemberService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GroupMemberImpl implements IGroupMemberService{

    private final GroupMemberRepository groupMemberRepository;

    @Override
    public GroupMember addMember(GroupMember member) {
        boolean exists = groupMemberRepository.existsByGroupChat_GroupChatIdAndUser_UserId(
            member.getGroupChat().getGroupChatId(),
            member.getUser().getUserId()
        );
        if (exists) {
            throw new RuntimeException("User already in group");
        }
        return groupMemberRepository.save(member);
    }

    @Override
    public List<GroupMember> getMembersByGroupId(String groupChatId) {
        return groupMemberRepository.findByGroupChat_GroupChatId(groupChatId);
    }

    @Override
    public List<GroupMember> getGroupsByUserId(String userId) {
        return groupMemberRepository.findByUser_UserId(userId);
    }
}
