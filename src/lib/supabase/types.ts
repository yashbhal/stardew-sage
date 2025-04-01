export type ButtonType = 'love_website' | 'want_app'

export interface FeedbackClick {
  id: string
  button_type: ButtonType
  user_fingerprint: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      feedback_clicks: {
        Row: FeedbackClick
        Insert: Omit<FeedbackClick, 'id' | 'created_at'>
        Update: Partial<Omit<FeedbackClick, 'id' | 'created_at'>>
      }
    }
  }
}
