package backend.back_temp_chat.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class GroupMember {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String groupMemberId;

    @ManyToOne
    @JoinColumn(name = "group_chat_id")
    private GroupChat groupChat;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
