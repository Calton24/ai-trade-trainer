export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      account_deletion_requests: {
        Row: {
          processed_at: string | null
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          processed_at?: string | null
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          processed_at?: string | null
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_deletion_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "account_deletion_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      achievements: {
        Row: {
          bonus_xp: number
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          bonus_xp?: number
          category?: string | null
          created_at?: string
          description?: string | null
          id: string
          name: string
        }
        Update: {
          bonus_xp?: number
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      ai_reviews: {
        Row: {
          beginner_explanation: string | null
          created_at: string
          drill_session_id: string | null
          id: string
          improvement: string | null
          marks: Json
          mistakes: string[]
          model: string | null
          recommendation: string | null
          risk_reward_feedback: string | null
          score: number
          strengths: string[]
          summary: string | null
          user_id: string
        }
        Insert: {
          beginner_explanation?: string | null
          created_at?: string
          drill_session_id?: string | null
          id?: string
          improvement?: string | null
          marks?: Json
          mistakes?: string[]
          model?: string | null
          recommendation?: string | null
          risk_reward_feedback?: string | null
          score: number
          strengths?: string[]
          summary?: string | null
          user_id: string
        }
        Update: {
          beginner_explanation?: string | null
          created_at?: string
          drill_session_id?: string | null
          id?: string
          improvement?: string | null
          marks?: Json
          mistakes?: string[]
          model?: string | null
          recommendation?: string | null
          risk_reward_feedback?: string | null
          score?: number
          strengths?: string[]
          summary?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_reviews_drill_session_id_fkey"
            columns: ["drill_session_id"]
            isOneToOne: false
            referencedRelation: "drill_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ai_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          completed_at: string
          detected_weaknesses: string[]
          id: string
          overall_score: number
          pillar_scores: Json
          trader_level: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          completed_at?: string
          detected_weaknesses?: string[]
          id?: string
          overall_score: number
          pillar_scores?: Json
          trader_level: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          completed_at?: string
          detected_weaknesses?: string[]
          id?: string
          overall_score?: number
          pillar_scores?: Json
          trader_level?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      behavioral_events: {
        Row: {
          created_at: string
          entity_id: string
          event_type: string
          id: string
          metadata: Json
          pillar: string
          score: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id?: string
          event_type: string
          id?: string
          metadata?: Json
          pillar: string
          score?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          event_type?: string
          id?: string
          metadata?: Json
          pillar?: string
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "behavioral_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "behavioral_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      book_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          concept_id: string
          id: string
          score: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          concept_id: string
          id?: string
          score?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          concept_id?: string
          id?: string
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "book_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chart_drill_sessions: {
        Row: {
          completed_at: string
          drill_type: string
          id: string
          payload: Json
          score: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          drill_type: string
          id?: string
          payload?: Json
          score?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          drill_type?: string
          id?: string
          payload?: Json
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chart_drill_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chart_drill_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chart_progress: {
        Row: {
          attempts: number
          best_score: number
          completed: boolean
          exercise_id: string
          id: string
          last_attempted_at: string | null
          user_id: string
        }
        Insert: {
          attempts?: number
          best_score?: number
          completed?: boolean
          exercise_id: string
          id?: string
          last_attempted_at?: string | null
          user_id: string
        }
        Update: {
          attempts?: number
          best_score?: number
          completed?: boolean
          exercise_id?: string
          id?: string
          last_attempted_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chart_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chart_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_waitlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "community_waitlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      drill_sessions: {
        Row: {
          completed_at: string | null
          drill_type: string
          id: string
          marks: Json
          pair: string
          score: number | null
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          drill_type: string
          id?: string
          marks?: Json
          pair?: string
          score?: number | null
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          drill_type?: string
          id?: string
          marks?: Json
          pair?: string
          score?: number | null
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drill_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "drill_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed_at: string | null
          content_id: string
          content_type: string
          enrolled_at: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          content_id: string
          content_type: string
          enrolled_at?: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          content_id?: string
          content_type?: string
          enrolled_at?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_enrollments: {
        Row: {
          enrolled_at: string
          feature_id: string
          id: string
          user_id: string
        }
        Insert: {
          enrolled_at?: string
          feature_id: string
          id?: string
          user_id: string
        }
        Update: {
          enrolled_at?: string
          feature_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feature_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcard_progress: {
        Row: {
          card_id: string
          confidence_level: string
          ease_factor: number
          id: string
          interval_days: number
          last_reviewed_at: string | null
          next_review_date: string | null
          repetitions: number
          user_id: string
        }
        Insert: {
          card_id: string
          confidence_level?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          last_reviewed_at?: string | null
          next_review_date?: string | null
          repetitions?: number
          user_id: string
        }
        Update: {
          card_id?: string
          confidence_level?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          last_reviewed_at?: string | null
          next_review_date?: string | null
          repetitions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "flashcard_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string
          friend_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          ai_feedback_summary: string | null
          confidence_rating: number | null
          created_at: string
          drill_session_id: string | null
          id: string
          marks_summary: string | null
          mistake_tag: string | null
          personal_note: string | null
          setup_practiced: string
          user_id: string
        }
        Insert: {
          ai_feedback_summary?: string | null
          confidence_rating?: number | null
          created_at?: string
          drill_session_id?: string | null
          id?: string
          marks_summary?: string | null
          mistake_tag?: string | null
          personal_note?: string | null
          setup_practiced: string
          user_id: string
        }
        Update: {
          ai_feedback_summary?: string | null
          confidence_rating?: number | null
          created_at?: string
          drill_session_id?: string | null
          id?: string
          marks_summary?: string | null
          mistake_tag?: string | null
          personal_note?: string | null
          setup_practiced?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_drill_session_id_fkey"
            columns: ["drill_session_id"]
            isOneToOne: false
            referencedRelation: "drill_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          created_at: string
          description: string | null
          difficulty: string
          estimated_hours: number
          id: string
          is_pro_only: boolean
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: string
          estimated_hours?: number
          id: string
          is_pro_only?: boolean
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: string
          estimated_hours?: number
          id?: string
          is_pro_only?: boolean
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          category: string | null
          content: Json
          created_at: string
          id: string
          is_pro_only: boolean
          key_idea: string | null
          module_id: string | null
          path_id: string | null
          sort_order: number
          subtitle: string | null
          title: string
          xp_reward: number
        }
        Insert: {
          category?: string | null
          content?: Json
          created_at?: string
          id: string
          is_pro_only?: boolean
          key_idea?: string | null
          module_id?: string | null
          path_id?: string | null
          sort_order?: number
          subtitle?: string | null
          title: string
          xp_reward?: number
        }
        Update: {
          category?: string | null
          content?: Json
          created_at?: string
          id?: string
          is_pro_only?: boolean
          key_idea?: string | null
          module_id?: string | null
          path_id?: string | null
          sort_order?: number
          subtitle?: string | null
          title?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      live_trading_phase: {
        Row: {
          checklist: Json
          current_phase: string
          emotional_violations: number
          go_live_unlocked_at: string | null
          journal_completion_rate: number
          live_prep_unlocked_at: string | null
          losing_streak_scenario_passed: boolean
          risk_quiz_passed: boolean
          simulated_unlocked_at: string | null
          strategy_clarity_passed: boolean
          trades_in_phase: number
          updated_at: string
          user_id: string
        }
        Insert: {
          checklist?: Json
          current_phase?: string
          emotional_violations?: number
          go_live_unlocked_at?: string | null
          journal_completion_rate?: number
          live_prep_unlocked_at?: string | null
          losing_streak_scenario_passed?: boolean
          risk_quiz_passed?: boolean
          simulated_unlocked_at?: string | null
          strategy_clarity_passed?: boolean
          trades_in_phase?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          checklist?: Json
          current_phase?: string
          emotional_violations?: number
          go_live_unlocked_at?: string | null
          journal_completion_rate?: number
          live_prep_unlocked_at?: string | null
          losing_streak_scenario_passed?: boolean
          risk_quiz_passed?: boolean
          simulated_unlocked_at?: string | null
          strategy_clarity_passed?: boolean
          trades_in_phase?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_trading_phase_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "live_trading_phase_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          created_at: string
          description: string | null
          difficulty: string
          estimated_minutes: number
          id: string
          path_id: string | null
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: string
          estimated_minutes?: number
          id: string
          path_id?: string | null
          sort_order: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: string
          estimated_minutes?: number
          id?: string
          path_id?: string | null
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          challenge_reminder: boolean
          daily_reminder: boolean
          leaderboard_updates: boolean
          new_content_updates: boolean
          streak_reminder: boolean
          updated_at: string
          user_id: string
          weekly_target_reminder: boolean
        }
        Insert: {
          challenge_reminder?: boolean
          daily_reminder?: boolean
          leaderboard_updates?: boolean
          new_content_updates?: boolean
          streak_reminder?: boolean
          updated_at?: string
          user_id: string
          weekly_target_reminder?: boolean
        }
        Update: {
          challenge_reminder?: boolean
          daily_reminder?: boolean
          leaderboard_updates?: boolean
          new_content_updates?: boolean
          streak_reminder?: boolean
          updated_at?: string
          user_id?: string
          weekly_target_reminder?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      path_enrollments: {
        Row: {
          completed_at: string | null
          id: string
          path_id: string
          progress_percent: number
          started_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          path_id: string
          progress_percent?: number
          started_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          path_id?: string
          progress_percent?: number
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "path_enrollments_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "path_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "path_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      path_progress: {
        Row: {
          completed_lessons: string[]
          completed_quizzes: string[]
          id: string
          path_id: string
          percentage_complete: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_lessons?: string[]
          completed_quizzes?: string[]
          id?: string
          path_id: string
          percentage_complete?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_lessons?: string[]
          completed_quizzes?: string[]
          id?: string
          path_id?: string
          percentage_complete?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "path_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "path_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      privacy_settings: {
        Row: {
          friend_leaderboard_visible: boolean
          leaderboard_visible: boolean
          show_country: boolean
          show_streak: boolean
          show_trader_rank: boolean
          show_username: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          friend_leaderboard_visible?: boolean
          leaderboard_visible?: boolean
          show_country?: boolean
          show_streak?: boolean
          show_trader_rank?: boolean
          show_username?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          friend_leaderboard_visible?: boolean
          leaderboard_visible?: boolean
          show_country?: boolean
          show_streak?: boolean
          show_trader_rank?: boolean
          show_username?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "privacy_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "privacy_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_path_id: string | null
          avatar_url: string | null
          books_completed: number
          competency_score: number
          country: string | null
          created_at: string
          display_name: string | null
          drills_completed: number
          drills_completed_today: number
          drills_reset_at: string
          email: string | null
          experience_level: string | null
          id: string
          last_practice_date: string | null
          leaderboard_opt_in: boolean
          learning_plan: string | null
          lessons_completed: number
          level: number
          onboarding_completed: boolean
          onboarding_completed_at: string | null
          onboarding_step: number
          plan: string
          preferred_market: string | null
          public_leaderboard: boolean
          quizzes_completed: number
          rank_tier: number
          streak: number
          stripe_customer_id: string | null
          strongest_skill: string | null
          study_intensity: string | null
          trading_experience: string | null
          trading_goals: Json
          updated_at: string
          username: string | null
          weakest_skill: string | null
          weekly_target_days: number | null
          xp: number
          xp_month: number
          xp_period_key_day: string | null
          xp_period_key_month: string | null
          xp_period_key_week: string | null
          xp_today: number
          xp_week: number
        }
        Insert: {
          active_path_id?: string | null
          avatar_url?: string | null
          books_completed?: number
          competency_score?: number
          country?: string | null
          created_at?: string
          display_name?: string | null
          drills_completed?: number
          drills_completed_today?: number
          drills_reset_at?: string
          email?: string | null
          experience_level?: string | null
          id: string
          last_practice_date?: string | null
          leaderboard_opt_in?: boolean
          learning_plan?: string | null
          lessons_completed?: number
          level?: number
          onboarding_completed?: boolean
          onboarding_completed_at?: string | null
          onboarding_step?: number
          plan?: string
          preferred_market?: string | null
          public_leaderboard?: boolean
          quizzes_completed?: number
          rank_tier?: number
          streak?: number
          stripe_customer_id?: string | null
          strongest_skill?: string | null
          study_intensity?: string | null
          trading_experience?: string | null
          trading_goals?: Json
          updated_at?: string
          username?: string | null
          weakest_skill?: string | null
          weekly_target_days?: number | null
          xp?: number
          xp_month?: number
          xp_period_key_day?: string | null
          xp_period_key_month?: string | null
          xp_period_key_week?: string | null
          xp_today?: number
          xp_week?: number
        }
        Update: {
          active_path_id?: string | null
          avatar_url?: string | null
          books_completed?: number
          competency_score?: number
          country?: string | null
          created_at?: string
          display_name?: string | null
          drills_completed?: number
          drills_completed_today?: number
          drills_reset_at?: string
          email?: string | null
          experience_level?: string | null
          id?: string
          last_practice_date?: string | null
          leaderboard_opt_in?: boolean
          learning_plan?: string | null
          lessons_completed?: number
          level?: number
          onboarding_completed?: boolean
          onboarding_completed_at?: string | null
          onboarding_step?: number
          plan?: string
          preferred_market?: string | null
          public_leaderboard?: boolean
          quizzes_completed?: number
          rank_tier?: number
          streak?: number
          stripe_customer_id?: string | null
          strongest_skill?: string | null
          study_intensity?: string | null
          trading_experience?: string | null
          trading_goals?: Json
          updated_at?: string
          username?: string | null
          weakest_skill?: string | null
          weekly_target_days?: number | null
          xp?: number
          xp_month?: number
          xp_period_key_day?: string | null
          xp_period_key_month?: string | null
          xp_period_key_week?: string | null
          xp_today?: number
          xp_week?: number
        }
        Relationships: []
      }
      progress_archives: {
        Row: {
          archived_at: string
          archived_state: Json
          id: string
          section: string
          user_id: string
        }
        Insert: {
          archived_at?: string
          archived_state: Json
          id?: string
          section: string
          user_id: string
        }
        Update: {
          archived_at?: string
          archived_state?: Json
          id?: string
          section?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_archives_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "progress_archives_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_reset_events: {
        Row: {
          created_at: string
          id: string
          section: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          section: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          section?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_reset_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "progress_reset_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          answers: Json
          completed_at: string
          id: string
          passed: boolean
          quiz_id: string
          score: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          answers?: Json
          completed_at?: string
          id?: string
          passed?: boolean
          quiz_id: string
          score: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          answers?: Json
          completed_at?: string
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          created_at: string
          explanation: string | null
          id: string
          options: Json
          question: string
          question_type: string
          quiz_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          explanation?: string | null
          id: string
          options?: Json
          question: string
          question_type?: string
          quiz_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json
          question?: string
          question_type?: string
          quiz_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          passing_score: number
          path_id: string | null
          title: string
          xp_reward: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: string
          passing_score?: number
          path_id?: string | null
          title: string
          xp_reward?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          passing_score?: number
          path_id?: string | null
          title?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      simulator_sessions: {
        Row: {
          completed_at: string
          id: string
          passed: boolean
          payload: Json
          score: number | null
          stage_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          passed?: boolean
          payload?: Json
          score?: number | null
          stage_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          passed?: boolean
          payload?: Json
          score?: number | null
          stage_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulator_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "simulator_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_progress: {
        Row: {
          exercises_completed: number
          id: string
          mastery_score: number
          strategy_id: string
          unlocked: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          exercises_completed?: number
          id?: string
          mastery_score?: number
          strategy_id: string
          unlocked?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          exercises_completed?: number
          id?: string
          mastery_score?: number
          strategy_id?: string
          unlocked?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategy_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "strategy_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_sessions: {
        Row: {
          completed_at: string
          id: string
          payload: Json
          score: number | null
          session_type: string
          strategy_id: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          payload?: Json
          score?: number | null
          session_type: string
          strategy_id?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          payload?: Json
          score?: number | null
          session_type?: string
          strategy_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategy_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "strategy_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      streaks: {
        Row: {
          current_streak: number
          last_activity_date: string | null
          longest_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          last_activity_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          last_activity_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trader_competence: {
        Row: {
          assessment_count: number
          chart_score: number
          consistency_score: number
          drill_count: number
          execution_score: number
          journal_completion_rate: number
          knowledge_score: number
          overall_score: number
          psychology_score: number
          recommended_next_module: string | null
          risk_score: number
          trade_selection_score: number
          updated_at: string
          user_id: string
          weakest_area: string | null
        }
        Insert: {
          assessment_count?: number
          chart_score?: number
          consistency_score?: number
          drill_count?: number
          execution_score?: number
          journal_completion_rate?: number
          knowledge_score?: number
          overall_score?: number
          psychology_score?: number
          recommended_next_module?: string | null
          risk_score?: number
          trade_selection_score?: number
          updated_at?: string
          user_id: string
          weakest_area?: string | null
        }
        Update: {
          assessment_count?: number
          chart_score?: number
          consistency_score?: number
          drill_count?: number
          execution_score?: number
          journal_completion_rate?: number
          knowledge_score?: number
          overall_score?: number
          psychology_score?: number
          recommended_next_module?: string | null
          risk_score?: number
          trade_selection_score?: number
          updated_at?: string
          user_id?: string
          weakest_area?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trader_competence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trader_competence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trend_progress: {
        Row: {
          accuracy_rate: number
          completed: boolean
          completed_at: string | null
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          accuracy_rate?: number
          completed?: boolean
          completed_at?: string | null
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          accuracy_rate?: number
          completed?: boolean
          completed_at?: string | null
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trend_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trend_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trend_sessions: {
        Row: {
          completed_at: string
          entity_id: string | null
          id: string
          payload: Json
          score: number | null
          session_type: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          entity_id?: string | null
          id?: string
          payload?: Json
          score?: number | null
          session_type: string
          user_id: string
        }
        Update: {
          completed_at?: string
          entity_id?: string | null
          id?: string
          payload?: Json
          score?: number | null
          session_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trend_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trend_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          bonus_xp: number
          earned_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          bonus_xp?: number
          earned_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          bonus_xp?: number
          earned_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_learning_state: {
        Row: {
          state_json: Json
          state_version: number
          updated_at: string
          user_id: string
        }
        Insert: {
          state_json?: Json
          state_version?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          state_json?: Json
          state_version?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_learning_state_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_learning_state_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_progress: {
        Row: {
          attempts: number
          id: string
          last_updated: string
          lesson_id: string
          score: number | null
          status: string
          user_id: string
        }
        Insert: {
          attempts?: number
          id?: string
          last_updated?: string
          lesson_id: string
          score?: number | null
          status?: string
          user_id: string
        }
        Update: {
          attempts?: number
          id?: string
          last_updated?: string
          lesson_id?: string
          score?: number | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          attempts: number
          completed_at: string | null
          entity_id: string
          entity_type: string
          id: string
          score: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number
          completed_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          score?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number
          completed_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          score?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          settings_json: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          settings_json?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          settings_json?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          books_completed: number
          competency_score: number
          current_streak: number
          drills_completed: number
          highest_rank_tier: number
          last_activity_at: string | null
          lessons_completed: number
          lifetime_xp: number
          longest_streak: number
          quizzes_completed: number
          simulations_completed: number
          updated_at: string
          user_id: string
        }
        Insert: {
          books_completed?: number
          competency_score?: number
          current_streak?: number
          drills_completed?: number
          highest_rank_tier?: number
          last_activity_at?: string | null
          lessons_completed?: number
          lifetime_xp?: number
          longest_streak?: number
          quizzes_completed?: number
          simulations_completed?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          books_completed?: number
          competency_score?: number
          current_streak?: number
          drills_completed?: number
          highest_rank_tier?: number
          last_activity_at?: string | null
          lessons_completed?: number
          lifetime_xp?: number
          longest_streak?: number
          quizzes_completed?: number
          simulations_completed?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: string
          provider: string
          provider_customer_id: string | null
          provider_subscription_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          provider?: string
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          provider?: string
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weekly_targets: {
        Row: {
          active_days_by_week: Json
          days_per_week: number
          last_evaluated_week_key: string | null
          updated_at: string
          user_id: string
          weekly_streak: number
        }
        Insert: {
          active_days_by_week?: Json
          days_per_week: number
          last_evaluated_week_key?: string | null
          updated_at?: string
          user_id: string
          weekly_streak?: number
        }
        Update: {
          active_days_by_week?: Json
          days_per_week?: number
          last_evaluated_week_key?: string | null
          updated_at?: string
          user_id?: string
          weekly_streak?: number
        }
        Relationships: [
          {
            foreignKeyName: "weekly_targets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "weekly_targets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_events: {
        Row: {
          amount: number
          created_at: string
          date_key: string
          id: string
          month_key: string
          reason: string | null
          source: string
          source_id: string | null
          user_id: string
          week_key: string
        }
        Insert: {
          amount: number
          created_at?: string
          date_key: string
          id?: string
          month_key: string
          reason?: string | null
          source: string
          source_id?: string | null
          user_id: string
          week_key: string
        }
        Update: {
          amount?: number
          created_at?: string
          date_key?: string
          id?: string
          month_key?: string
          reason?: string | null
          source?: string
          source_id?: string | null
          user_id?: string
          week_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "xp_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_public"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "xp_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      leaderboard_public: {
        Row: {
          avatar_url: string | null
          competency_score: number | null
          country: string | null
          current_streak: number | null
          daily_xp: number | null
          display_name: string | null
          highest_rank_tier: number | null
          lifetime_xp: number | null
          monthly_xp: number | null
          public_leaderboard: boolean | null
          user_id: string | null
          username: string | null
          weekly_xp: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
