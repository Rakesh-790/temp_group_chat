package backend.back_temp_chat.service.ServiceImpl;


import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import backend.back_temp_chat.entity.Message;
import backend.back_temp_chat.repository.MessageRepository;
import backend.back_temp_chat.service.IService.IMessageService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements IMessageService{

    private final MessageRepository messageRepository;

    @Override
    public Message sendMessage(Message message) {
        message.setSentAt(new Date());
        return messageRepository.save(message);
    }

    @Override
    public List<Message> getMessagesByGroup(String groupChatId) {
        return messageRepository.findByGroupChat_GroupChatIdOrderBySentAtAsc(groupChatId);
    }
}
