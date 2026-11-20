const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '51a3f433-cef3-40ea-8a2c-4ff501c82ae9';

export interface MailDeliveryResult {
  success: boolean;
  message: string;
}

function isValidEmail(email?: string): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Sends a user feedback / rating review to the owner's email via Web3Forms.
 * Must run client-side because Web3Forms free tier restricts server-originated POSTs.
 */
export async function sendFeedbackEmail(params: {
  rating: number;
  reviewerName: string;
  reviewerEmail?: string;
  improvementAreas?: string[];
  comment: string;
}): Promise<MailDeliveryResult> {
  const cleanName = params.reviewerName.trim() || 'Community Member';
  const cleanComment = params.comment.trim();
  const cleanEmail = params.reviewerEmail?.trim();
  const cleanAreas = Array.isArray(params.improvementAreas)
    ? params.improvementAreas.filter(Boolean)
    : [];

  const payload: Record<string, string | number | boolean> = {
    access_key: WEB3FORMS_ACCESS_KEY,
    from_name: 'ResourceBox Feedback',
    subject: `[ResourceBox] New ${params.rating}-Star Feedback Review from ${cleanName}`,
    reviewer_name: cleanName,
    rating: `${params.rating} / 5 Stars`,
    ...(cleanAreas.length > 0 ? { areas_of_improvement: cleanAreas.join(', ') } : {}),
    message: `Rating: ${'★'.repeat(params.rating)}${'☆'.repeat(Math.max(0, 5 - params.rating))} (${params.rating}/5)\nReviewer: ${cleanName}${isValidEmail(cleanEmail) ? `\nEmail: ${cleanEmail}` : ''}${cleanAreas.length > 0 ? `\nAreas of Improvement: ${cleanAreas.join(', ')}` : ''}\n\nFeedback:\n${cleanComment}`,
    project: 'ResourceBox — Rent, Share & Exchange',
    owner: 'Gaurav Kumar',
    botcheck: false,
  };

  if (isValidEmail(cleanEmail)) {
    payload.email = cleanEmail!;
    payload.replyto = cleanEmail!;
  }

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.success) {
      return { success: true, message: data.message || 'Feedback delivered to owner mail.' };
    }
    return {
      success: false,
      message: data?.message || 'Unable to deliver feedback email right now.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Network error while sending feedback email.',
    };
  }
}

/**
 * Sends a direct contact / support / inquiry mail to Gaurav Kumar via Web3Forms.
 */
export async function sendDirectMail(params: {
  senderName: string;
  senderEmail: string;
  topic: string;
  subject?: string;
  message: string;
}): Promise<MailDeliveryResult> {
  const cleanName = params.senderName.trim();
  const cleanEmail = params.senderEmail.trim();
  const cleanTopic = params.topic.trim() || 'General Inquiry';
  const cleanSubject = params.subject?.trim();
  const cleanMessage = params.message.trim();

  if (!cleanName) {
    return { success: false, message: 'Please enter your name.' };
  }
  if (!isValidEmail(cleanEmail)) {
    return { success: false, message: 'Please enter a valid email address so we can reply.' };
  }
  if (cleanMessage.length < 5) {
    return { success: false, message: 'Please enter a message of at least 5 characters.' };
  }

  const emailSubject = cleanSubject
    ? `[ResourceBox Mail] ${cleanTopic}: ${cleanSubject}`
    : `[ResourceBox Mail] ${cleanTopic} — from ${cleanName}`;

  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,
    from_name: `${cleanName} via ResourceBox`,
    subject: emailSubject,
    name: cleanName,
    email: cleanEmail,
    replyto: cleanEmail,
    topic: cleanTopic,
    message: cleanMessage,
    project: 'ResourceBox — Rent, Share & Exchange',
    owner: 'Gaurav Kumar',
    botcheck: false,
  };

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.success) {
      return { success: true, message: data.message || 'Mail sent successfully to Gaurav Kumar.' };
    }
    return {
      success: false,
      message: data?.message || 'Could not deliver mail right now. Please try again.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Network error while sending mail.',
    };
  }
}
