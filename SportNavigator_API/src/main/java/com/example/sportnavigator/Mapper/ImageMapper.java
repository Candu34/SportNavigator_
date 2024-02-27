package com.example.sportnavigator.Mapper;

import com.example.sportnavigator.DTO.EncodedImage;
import com.example.sportnavigator.Models.CourtImage;
import com.example.sportnavigator.Models.SportCourt;
import com.example.sportnavigator.Models.User;
import com.example.sportnavigator.Models.UserImage;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.stereotype.Component;

@Component
public class ImageMapper {

    public UserImage EncodedImageToImage(EncodedImage encodedImage, User user) {
        UserImage image = new UserImage();

        byte[] data = Base64.decodeBase64(encodedImage.getData());
        image.setBytes(data);
        image.setMime(encodedImage.getMime());
        image.setUser(user);

        return image;
    }

    public CourtImage EncodedImageToCourtImage(EncodedImage encodedImage, SportCourt sportCourt) {
        CourtImage image = new CourtImage();
        byte[] data = Base64.decodeBase64(encodedImage.getData());
        image.setBytes(data);
        image.setMime(encodedImage.getMime());
        image.setSportCourt(sportCourt);
        return image;
    }

    public <T> EncodedImage ImageToEncodedImage(T image) {
        EncodedImage encodedImage = new EncodedImage();
        if (image instanceof UserImage) {
            encodedImage.setMime(((UserImage) image).getMime());
            encodedImage.setData(Base64.encodeBase64String(((UserImage) image).getBytes()));
        } else if (image instanceof CourtImage) {
            encodedImage.setMime(((CourtImage) image).getMime());
            encodedImage.setData(Base64.encodeBase64String(((CourtImage) image).getBytes()));
        }
        return encodedImage;
    }
}
