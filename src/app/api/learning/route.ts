import { NextRequest, NextResponse } from 'next/server';

// Challenge completion tracking
const completedChallenges = new Map<string, string[]>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'anonymous';

    const userCompletions = completedChallenges.get(userId) || [];

    return NextResponse.json({
      success: true,
      completedChallenges: userCompletions,
      totalPoints: userCompletions.length * 100, // Simplified
      stats: {
        completed: userCompletions.length,
        total: 24,
        rank: Math.floor(Math.random() * 100) + 1
      }
    });
  } catch (error) {
    console.error('Learning API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learning data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'anonymous', challengeId, action } = body;

    if (action === 'complete') {
      const userCompletions = completedChallenges.get(userId) || [];
      if (!userCompletions.includes(challengeId)) {
        userCompletions.push(challengeId);
        completedChallenges.set(userId, userCompletions);
      }

      return NextResponse.json({
        success: true,
        message: 'Challenge completed!',
        points: 100,
        totalPoints: userCompletions.length * 100
      });
    }

    if (action === 'test') {
      // Simulate testing a payload
      const { category, payload, difficulty } = body;

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simple validation logic
      let success = false;
      let message = '';

      if (category === 'SQL Injection') {
        if (difficulty === 'low' && (payload.includes("'") || payload.includes('OR'))) {
          success = true;
          message = 'SQL Injection successful! Bypassed authentication.';
        } else if (difficulty === 'medium' && payload.includes('UNION')) {
          success = true;
          message = 'UNION-based SQL injection successful!';
        }
      } else if (category === 'Cross-Site Scripting') {
        if (difficulty === 'low' && payload.includes('<script>')) {
          success = true;
          message = 'XSS payload executed successfully!';
        } else if (difficulty === 'medium' && (payload.includes('onerror') || payload.includes('onload'))) {
          success = true;
          message = 'Event-based XSS successful!';
        }
      } else if (category === 'Command Injection') {
        if (payload.includes('&&') || payload.includes('||') || payload.includes(';')) {
          success = true;
          message = 'Command injection successful! Executed system command.';
        }
      }

      if (!success) {
        message = 'Payload blocked by security filters. Try a different approach.';
      }

      return NextResponse.json({
        success,
        message,
        output: success ? 'root:x:0:0:root:/root:/bin/bash\nadmin:x:1000:1000::/home/admin:/bin/bash' : null
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Learning action error:', error);
    return NextResponse.json(
      { error: 'Action failed' },
      { status: 500 }
    );
  }
}
