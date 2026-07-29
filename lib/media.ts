const VIDEO_EXTENSIONS = /\.(mp4|webm|mov)$/i;

export type Media = { src: string; isVideo: boolean };

export function toMedia(src: string): Media {
  return { src, isVideo: VIDEO_EXTENSIONS.test(src) };
}
