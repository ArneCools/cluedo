package be.kdg.cluedobackend.controllers.messagehandlers;

import be.kdg.cluedobackend.dto.PlayerDto;
import be.kdg.cluedobackend.model.users.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class SuggestionReplyHandler extends MessageHandler<PlayerDto> {
    @Autowired
    public SuggestionReplyHandler(SimpMessagingTemplate webSocket) {
        super(webSocket, "/suggestionReply/");
    }


    @Override
    public void sendMessage(Integer cluedoId, PlayerDto player, UUID requestingUser) {
        webSocket.convertAndSend(CHANNEL + cluedoId, player);
    }
}
