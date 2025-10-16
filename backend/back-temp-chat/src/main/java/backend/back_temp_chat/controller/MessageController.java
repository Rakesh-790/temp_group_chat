package backend.back_temp_chat.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.back_temp_chat.entity.Message;
import backend.back_temp_chat.service.IService.IMessageService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MessageController {

    private IMessageService messageService;

    @PostMapping("/send")
    public Message sendMessage(@RequestBody Message message) {
        return messageService.sendMessage(message);
    }

    @GetMapping("/group/{groupId}")
    public List<Message> getMessagesByGroup(@PathVariable String groupId) {
        return messageService.getMessagesByGroup(groupId);
    }
}
