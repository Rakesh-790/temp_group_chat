package backend.back_temp_chat.service.IService;

import java.util.List;

import backend.back_temp_chat.entity.GroupChat;

public interface IGroupChatService {
    GroupChat createGroup(GroupChat groupChat);

    List<GroupChat> getAllActiveGroups();

    void deleteExpiredGroups();
}
