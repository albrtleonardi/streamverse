// src/types/StreamTypes.ts

export interface UserProfile {
    full_name: string;
    profile_picture: string;
  }
  
  export interface User {
    email: string;
    hederaAccountId: string;
    hederaPrivateKey: string;
    profile: UserProfile;
  }
  
  export interface Stream {
    id: string;
    user_id: number;
    title: string;
    thumbnail: string;
    stream_url: string;
    is_live: boolean;
    topic_id: string;
    user: User;
    views: number;
  }
  