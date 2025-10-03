import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { activity, startTime, endTime, duration, notes, mood, energyLevel } = body

    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Save activity
    const { data, error } = await supabase
      .from('manual_activities')
      .insert({
        user_id: user.id,
        activity_type: activity.id,
        activity_name: activity.name,
        category: activity.category,
        start_time: startTime,
        end_time: endTime,
        duration_seconds: duration,
        notes,
        mood,
        energy_level: energyLevel,
        tracking_method: 'manual'
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to save activity' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      activity: data[0]
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's recent activities
    const { data: activities, error } = await supabase
      .from('manual_activities')
      .select('*')
      .eq('user_id', user.id)
      .order('start_time', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      activities: activities || []
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}