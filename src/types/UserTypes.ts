import { StreamType } from "./StreamTypes";

export type UserType = {
  id: number;
  email: string;
  password: string;
  hederaAccountId: string;
  profile: ProfileType;
  stream: StreamType;
  followerCount: number;
};

export type ProfileType = {
  user_id: number;
  full_name: string;
  bio: string;
  wallet_address: string;
  gender: string;
  date_of_birth: Date;
  profile_picture: string;
};

export type SearchUserType = {
  user_id: number;
  full_name: string;
  is_live: boolean;
  profile_picture: string;
  bio: string;
  stream_title: string;
  followerCount: number;
  topic_id: string;
};
