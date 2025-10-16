package backend.back_temp_chat.service.IService;

import java.util.List;

import backend.back_temp_chat.entity.Message;

public interface IMessageService {
    Message sendMessage(Message message);

    List<Message> getMessagesByGroup(String groupChatId);
}
