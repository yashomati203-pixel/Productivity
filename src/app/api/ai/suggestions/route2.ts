import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateActivitySuggestions } from '@/lib/ai/suggestions'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get recent activities for context
    const { data: recentActivities } = await supabase
      .from('manual_activities')
      .select('*')
      .eq('user_id', user.id)
      .gte('start_time', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('start_time', { ascending: false })
      .limit(20)

    // Generate suggestions
    const suggestions = await generateActivitySuggestions({
      currentTime: new Date().toISOString(),
      recentActivities: recentActivities || [],
      calendarEvents: [], // Would integrate calendar here
      userPreferences: {}
    })

    return NextResponse.json({
      success: true,
      suggestions
    })
  } catch (error) {
    console.error('Suggestions API error:', error)
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 })
  }
}