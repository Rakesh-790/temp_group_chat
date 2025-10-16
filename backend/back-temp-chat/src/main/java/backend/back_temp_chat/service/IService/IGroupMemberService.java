package backend.back_temp_chat.service.IService;

import java.util.List;

import backend.back_temp_chat.entity.GroupMember;

public interface IGroupMemberService {
    GroupMember addMember(GroupMember member);

    List<GroupMember> getMembersByGroupId(String groupChatId);

    List<GroupMember> getGroupsByUserId(String userId);
}
