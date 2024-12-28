import React, { PropsWithChildren } from "react";

export const SongList = (props: PropsWithChildren) => (
  <ul className='max-w-4xl mx-auto p-4'>{props.children}</ul>
);

export const SongListItem = (props: {
  artist: string;
  title: string;
  key: string;
  highlight?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}) => (
  <li
    onClick={props.onClick}
    className={`flex space-x-4 p-4 border-b border-white-200 cursor-pointer ${
      props.highlight ? "bg-red-800" : ""
    }`}
  >
    <div>
      <img
        className='rounded-lg object-cover'
        alt={props.artist}
        src='https://www.pngall.com/wp-content/uploads/10/Knowledge-No-Background.png'
        width={100}
        height={75}
      />
    </div>
    <div>
      <p className='text-2xl font-semibold text-white-900'>{props.artist}</p>
      <p className='text-white-600'>{props.title}</p>
    </div>
  </li>
);
