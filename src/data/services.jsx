import { Code, Terminal, Palette, Video, Megaphone } from 'lucide-react';

export const servicesList = [
  {
    id: 'website-development',
    title: 'Website Development',
    description: 'We build responsive, modern, and high-performing websites tailored to your business needs, ensuring a stellar digital presence.',
    icon: <Code size={30} className="service-icon" />,
    image: '/images/website.jpg',
    details: 'Our website development service focuses on creating custom web applications and business sites that are fast, secure, and fully responsive across all devices. We utilize modern frameworks to ensure your digital storefront looks premium and converts visitors into loyal customers.'
  },
  {
    id: 'software-development',
    title: 'Software Development',
    description: 'Custom software solutions designed to streamline your operations, enhance productivity, and scale your business.',
    icon: <Terminal size={30} className="service-icon" />,
    image: '/images/software.jpg',
    details: 'We engineer robust, scalable software tailored to your specific operational needs. From complex enterprise resource planning systems to sleek mobile applications, our team delivers high-quality code that empowers your business to operate more efficiently.'
  },
  {
    id: 'graphic-designing',
    title: 'Graphic Designing',
    description: 'Eye-catching visuals and branding materials that communicate your message effectively and leave a lasting impression.',
    icon: <Palette size={30} className="service-icon" />,
    image: '/images/graphic.jpg',
    details: 'Our graphic design team crafts compelling visual identities that resonate with your target audience. Whether you need a full branding package, marketing collateral, or digital assets, we combine artistic vision with strategic thinking to make your brand stand out.'
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    description: 'Professional video editing services to tell your story, engage your audience, and elevate your brand on digital platforms.',
    icon: <Video size={30} className="service-icon" />,
    image: '/images/video.jpg',
    details: 'We transform raw footage into cinematic masterpieces. Our video editing services cover promotional content, corporate videos, and social media shorts, utilizing advanced color grading, motion graphics, and audio mixing to ensure your story captivates viewers.'
  },
  {
    id: 'social-media-marketing',
    title: 'Social Media Marketing',
    description: 'Strategic marketing campaigns to grow your audience, boost engagement, and drive conversions across all social channels.',
    icon: <Megaphone size={30} className="service-icon" />,
    image: '/images/social.jpg',
    details: 'Maximize your digital footprint with data-driven social media strategies. We manage your presence across key platforms, crafting engaging content and running targeted ad campaigns that build community, increase brand awareness, and drive measurable ROI.'
  }
];
