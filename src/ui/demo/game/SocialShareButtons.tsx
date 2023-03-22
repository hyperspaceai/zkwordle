import type { PopoverProps } from "@chakra-ui/react";
import {
  Button,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useClipboard,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import { isMobile } from "react-device-detect";
import { AiOutlineMail } from "react-icons/ai";
import { FaFacebookF, FaLinkedinIn, FaShareAlt, FaTelegramPlane, FaTwitter, FaWhatsapp } from "react-icons/fa";

const MotionPopoverContent = motion(PopoverContent);

interface Content {
  defaultMessage: string;
  hashtags?: string[];
  twitterMessage?: string;
  emailMessage?: string;
  telegramMessage?: string;
  whatsappMessage?: string;
}

interface SocialShareOverlayProps {
  HeaderText: string;
  url: string;
  content: Content;
  position?: PopoverProps["placement"];
}

const SocialShareOverlay: React.FC<SocialShareOverlayProps> = ({
  HeaderText,
  url,
  content,
  position = "bottom-end",
}) => {
  // Define the breakpoints
  const [isSmallerThan768] = useMediaQuery("(max-width: 767px)");

  const message = content.defaultMessage;
  const hashtags = content.hashtags?.join(",");

  // Set the Popover placement based on the screen size
  let placement = position;
  if (isSmallerThan768) {
    placement = "auto-start";
  }

  const fadeIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 },
  };

  const shareUrls: Record<Platforms, ShareUrl> = {
    twitter: {
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        content.twitterMessage || message,
      )}&hashtags=${hashtags}`,
      icon: FaTwitter,
      colorScheme: "twitter",
      backgroundColor: "#00acee",
    },
    facebook: {
      url: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURI(message)}&u=${encodeURI(url)}&hashtag=${
        hashtags && hashtags.length > 0 && `%23${hashtags}`
      }`,
      icon: FaFacebookF,
      colorScheme: "facebook",
      backgroundColor: "#3b5998",
    },
    whatsapp: {
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(content.whatsappMessage || message)}`,
      icon: FaWhatsapp,
      colorScheme: "whatsapp",
      backgroundColor: "#25d366",
    },
    telegram: {
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
        content.telegramMessage || message,
      )}`,
      icon: FaTelegramPlane,
      colorScheme: "telegram",
      backgroundColor: "#0088cc",
    },
    linkedin: {
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: FaLinkedinIn,
      colorScheme: "linkedin",
      backgroundColor: "#0e76a8",
    },
    email: {
      url: `mailto:?subject=Wordle Game with Zero Knowledge Proof!&body=${encodeURIComponent(
        content.emailMessage || message,
      )}`,
      icon: AiOutlineMail,
      colorScheme: "gray",
      backgroundColor: "gray.500",
    },
  };

  const handleMobileShare = async () => {
    const urlRegex = /(?:https?:\/\/[^\s]+)/g;
    try {
      await navigator.share({
        title: "zkWordle zero knowledge proof", // Update with your desired title
        text: message,
        url: urlRegex.test(message) ? undefined : url,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error sharing:", err);
    }
  };

  return (
    <>
      {isMobile ? (
        <Button
          aria-label="Share"
          border="1px solid white"
          colorScheme="white"
          onClick={() => void handleMobileShare()}
          size={{ base: "md", md: "lg" }}
        >
          <HStack gap="1">
            <FaShareAlt color="#00acee" />
            <Text textColor="white">Share</Text>
          </HStack>
        </Button>
      ) : (
        <Popover placement={placement}>
          <PopoverTrigger>
            <Button aria-label="Share" border="1px solid white" colorScheme="white" size={{ base: "md", md: "lg" }}>
              <HStack gap="1">
                <FaShareAlt color="#00acee" />
                <Text textColor="white">Share</Text>
              </HStack>
            </Button>
          </PopoverTrigger>
          <MotionPopoverContent minW="fit-content" {...fadeIn}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>{HeaderText}</PopoverHeader>
            <PopoverBody>
              <SocialShareButtons shareLink={url} shareUrls={shareUrls} />
            </PopoverBody>
          </MotionPopoverContent>
        </Popover>
      )}
    </>
  );
};

interface ShareUrl {
  url: string;
  icon: React.FC;
  colorScheme: string;
  backgroundColor: string;
}

interface SocialShareButtonsProps {
  shareLink: string;
  shareUrls: Record<Platforms, ShareUrl>;
}

type Platforms = "twitter" | "facebook" | "whatsapp" | "linkedin" | "telegram" | "email";

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ shareLink, shareUrls }) => {
  const { hasCopied, onCopy } = useClipboard(shareLink);

  const handleShareClick = (url: string, platform: Platforms) => {
    const width = 600;
    const height = 400;
    const left = window.screenX + window.outerWidth / 2 - width / 2;
    const top = window.screenY + window.outerHeight / 2 - height / 2;

    if (platform === "email") {
      return (window.location.href = url);
    }

    const newWindow = window.open(
      url,
      "_blank",
      `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`,
    );
    if (newWindow) {
      newWindow.opener = null;
      newWindow.location = url;

      // Disable the address bar and navigation controls.
      newWindow.document.addEventListener("DOMContentLoaded", () => {
        newWindow.document.body.style.pointerEvents = "none";
        newWindow.document.body.style.userSelect = "none";
        newWindow.document.body.style.cursor = "default";
      });
    }
  };

  return (
    <VStack alignItems="center" spacing={4}>
      <HStack spacing={4}>
        {Object.entries(shareUrls).map(([platform, { url, icon: Icon, backgroundColor }]) => (
          <IconButton
            key={platform}
            aria-label={`Share on ${platform}`}
            backgroundColor={backgroundColor}
            icon={<Icon />}
            onClick={() => void handleShareClick(url, platform as Platforms)}
            textColor="white"
          />
        ))}
      </HStack>
      <InputGroup size="sm">
        <Input cursor="not-allowed" isReadOnly placeholder="Your link to share" rounded="md" value={shareLink} />
        <InputRightElement width="auto">
          <Button onClick={onCopy} roundedLeft="none" roundedRight="md" size="sm">
            {hasCopied ? "Copied!" : "Copy"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </VStack>
  );
};

export default SocialShareOverlay;
