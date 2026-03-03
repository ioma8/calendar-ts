'use client';

import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

const shareUrl = 'https://ceskykalendar.vercel.app';
const shareTitle = 'Český Kalendář - generátor měsíčních kalendářů PDF';

export default function SocialShareButtons() {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-slate-500">Sdílet aplikaci</p>
      <div className="flex items-center gap-3">
        <FacebookShareButton url={shareUrl} hashtag="#ceskykalendar" aria-label="Sdílet na Facebooku">
          <FacebookIcon size={36} round />
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl} title={shareTitle} aria-label="Sdílet na síti X">
          <TwitterIcon size={36} round />
        </TwitterShareButton>
        <LinkedinShareButton url={shareUrl} title={shareTitle} summary={shareTitle} source={shareUrl} aria-label="Sdílet na LinkedIn">
          <LinkedinIcon size={36} round />
        </LinkedinShareButton>
        <WhatsappShareButton url={shareUrl} title={shareTitle} separator=" - " aria-label="Sdílet na WhatsAppu">
          <WhatsappIcon size={36} round />
        </WhatsappShareButton>
        <TelegramShareButton url={shareUrl} title={shareTitle} aria-label="Sdílet na Telegramu">
          <TelegramIcon size={36} round />
        </TelegramShareButton>
      </div>
    </div>
  );
}
