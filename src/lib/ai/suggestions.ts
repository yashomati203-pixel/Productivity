import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ActivitySuggestion {
  activity: string
  name: string
  reason: string
  confidence: number
  suggestedDuration: number
}

interface SuggestionRequest {
  currentTime: string
  recentActivities: any[]
  calendarEvents: any[]
  userPreferences: any
}

export async function generateActivitySuggestions({
  currentTime,
  recentActivities,
  calendarEvents,
  userPreferences
}: SuggestionRequest): Promise<{
  primary: ActivitySuggestion
  alternatives: ActivitySuggestion[]
}> {
  const hour = new Date(currentTime).getHours()
  
  // Fallback suggestions based on time
  if (hour >= 9 && hour <= 11) {
    return {
      primary: {
        activity: "deep-work",
        name: "Deep Work Session",
        reason: "Peak morning focus time - ideal for complex tasks",
        confidence: 85,
        suggestedDuration: 90
      },
      alternatives: [
        {
          activity: "coding",
          name: "Coding",
          reason: "High cognitive capacity window",
          confidence: 80,
          suggestedDuration: 120
        },
        {
          activity: "creative",
          name: "Creative Work",
          reason: "Morning creativity peak",
          confidence: 75,
          suggestedDuration: 60
        }
      ]
    }
  } else if (hour >= 14 && hour <= 16) {
    return {
      primary: {
        activity: "email",
        name: "Email & Admin",
        reason: "Post-lunch period - good for administrative tasks",
        confidence: 78,
        suggestedDuration: 45
      },
      alternatives: [
        {
          activity: "meetings",
          name: "Meetings",
          reason: "Good collaboration time",
          confidence: 75,
          suggestedDuration: 60
        },
        {
          activity: "planning",
          name: "Planning",
          reason: "Organize and prioritize tasks",
          confidence: 70,
          suggestedDuration: 30
        }
      ]
    }
  }

  // Default suggestions
  return {
    primary: {
      activity: "learning",
      name: "Learning & Development",
      reason: "Continuous improvement time",
      confidence: 65,
      suggestedDuration: 45
    },
    alternatives: [
      {
        activity: "research",
        name: "Research",
        reason: "Expand knowledge and explore ideas",
        confidence: 60,
        suggestedDuration: 30
      }
    ]
  }
}

export async function analyzeProductivityPattern(activities: any[]) {
  if (activities.length < 5) {
    return {
      insights: ["Collect more activity data for detailed insights"],
      recommendations: ["Track activities consistently for better analysis"],
      productivityScore: 50
    }
  }

  // Calculate basic productivity metrics
  const productiveActivities = activities.filter(a => 
    ['productive', 'learning', 'creative'].includes(a.category)
  )
  
  const totalTime = activities.reduce((sum, a) => sum + a.duration_seconds, 0)
  const productiveTime = productiveActivities.reduce((sum, a) => sum + a.duration_seconds, 0)
  
  const productivityScore = totalTime > 0 ? Math.round((productiveTime / totalTime) * 100) : 0
  
  return {
    insights: [
      `You spend ${Math.round(productiveTime / 3600)} hours on productive activities`,
      `Your productivity ratio is ${productivityScore}%`,
      productiveActivities.length > 0 ? 
        `Most common productive activity: ${productiveActivities[0]?.activity_name}` :
        "Try adding more productive activities to your routine"
    ],
    recommendations: [
      productivityScore < 60 ? "Consider dedicating more time to focus work" : "Great job maintaining productive habits!",
      "Track your energy levels to optimize task scheduling",
      "Use the Pomodoro technique for better focus sessions"
    ],
    productivityScore
  }
}