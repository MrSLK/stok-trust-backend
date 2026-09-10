import { baseEmailLayout } from "../../../libs/common/src/email/email.layouts";

export const sendStokvelInviteTemplate = (opts: {
  firstName: string;
  stokvelName: string;
  inviteCode: string;
  inviteLink: string;
}): string => {
  const body = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0f172a; margin-top: 0;">You've been invited!</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          Hi ${opts.firstName}, you've been invited to join
          <strong>${opts.stokvelName}</strong> on Stokvel App.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 4px; background: #f1f5f9; padding: 12px 24px; border-radius: 8px; color: #0f172a;">
            ${opts.inviteCode}
          </span>
        </div>
        <div style="text-align: center;">
          <a href="${opts.inviteLink}"
             style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: bold; font-size: 14px;">
            Accept Invite
          </a>
        </div>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
          If the button doesn't work, copy this link into your browser:<br/>
          <a href="${opts.inviteLink}" style="color: #10b981;">${opts.inviteLink}</a>
        </p>
      </div>`;

  return baseEmailLayout({
    body,
    title: `You've been invited to join ${opts.stokvelName}`
  });
};
