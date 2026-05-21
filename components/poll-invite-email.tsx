import * as React from "react";

interface PollInviteEmailProps {
  organizerName: string;
  organizerEmail: string;
  recipientName: string;
  recipientEmail: string;
  pollTitle: string;
  pollLocation: string | null;
  description: string | null;
  closesAt: Date | null;
  optionLabels: string[];
  token: string;
}

export function PollInviteEmail({
  organizerName,
  organizerEmail,
  recipientName,
  recipientEmail,
  pollTitle,
  pollLocation,
  description,
  closesAt,
  optionLabels,
  token,
}: PollInviteEmailProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  const voteUrl = `${baseUrl}/poll/${token}`;

  const mono = "'Courier New', Courier, monospace";
  const greetName = recipientName || recipientEmail || "there";
  const fromValue = organizerEmail || "noreply@invitely.gg";
  const closesLabel = closesAt
    ? closesAt.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{ backgroundColor: "#000000", padding: "40px 0", margin: 0 }}
    >
      <tbody>
        <tr>
          <td align="center">
            <table
              width="560"
              cellPadding="0"
              cellSpacing="0"
              style={{
                backgroundColor: "#0a0a0a",
                border: "1px solid #1f1f1f",
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      borderBottom: "1px solid #1f1f1f",
                      backgroundColor: "#111111",
                      padding: "14px 20px",
                    }}
                  >
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td
                            style={{
                              fontSize: "10px",
                              color: "#666666",
                              fontFamily: mono,
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                            }}
                          >
                            Date Poll · Invitely.gg
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              paddingTop: "6px",
                              fontSize: "11px",
                              color: "#888888",
                              fontFamily: mono,
                            }}
                          >
                            From {organizerName} &lt;{fromValue}&gt;
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "32px 24px 20px" }}>
                    <h1
                      style={{
                        margin: 0,
                        fontSize: "20px",
                        fontWeight: 600,
                        color: "#ffffff",
                        fontFamily: mono,
                        lineHeight: 1.3,
                      }}
                    >
                      {pollTitle}
                    </h1>
                    <p
                      style={{
                        marginTop: "12px",
                        marginBottom: 0,
                        fontSize: "13px",
                        color: "#aaaaaa",
                        fontFamily: mono,
                        lineHeight: 1.6,
                      }}
                    >
                      Hi {greetName}, {organizerName} is putting together a
                      gathering and wants to find a time that works for
                      everyone. Pick the slots you can make and submit — no
                      account required.
                    </p>
                  </td>
                </tr>

                {description && (
                  <tr>
                    <td style={{ padding: "0 24px 12px" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          color: "#888888",
                          fontFamily: mono,
                          lineHeight: 1.6,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {description}
                      </p>
                    </td>
                  </tr>
                )}

                <tr>
                  <td style={{ padding: "8px 24px 12px" }}>
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tbody>
                        {pollLocation && (
                          <tr>
                            <td
                              style={{
                                fontSize: "10px",
                                color: "#666666",
                                fontFamily: mono,
                                letterSpacing: "0.08em",
                                paddingRight: "12px",
                                paddingBottom: "6px",
                                width: "80px",
                              }}
                            >
                              LOCATION
                            </td>
                            <td
                              style={{
                                fontSize: "12px",
                                color: "#dddddd",
                                fontFamily: mono,
                                paddingBottom: "6px",
                              }}
                            >
                              {pollLocation}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td
                            style={{
                              fontSize: "10px",
                              color: "#666666",
                              fontFamily: mono,
                              letterSpacing: "0.08em",
                              paddingRight: "12px",
                              paddingBottom: "6px",
                              verticalAlign: "top",
                            }}
                          >
                            SLOTS
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              color: "#dddddd",
                              fontFamily: mono,
                              paddingBottom: "6px",
                              lineHeight: 1.7,
                            }}
                          >
                            {optionLabels.map((label, i) => (
                              <div key={i}>· {label}</div>
                            ))}
                          </td>
                        </tr>
                        {closesLabel && (
                          <tr>
                            <td
                              style={{
                                fontSize: "10px",
                                color: "#666666",
                                fontFamily: mono,
                                letterSpacing: "0.08em",
                                paddingRight: "12px",
                              }}
                            >
                              CLOSES
                            </td>
                            <td
                              style={{
                                fontSize: "12px",
                                color: "#dddddd",
                                fontFamily: mono,
                              }}
                            >
                              {closesLabel}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "12px 24px 28px" }}>
                    <table cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td>
                            <a
                              href={voteUrl}
                              style={{
                                display: "inline-block",
                                padding: "12px 18px",
                                backgroundColor: "#ffffff",
                                color: "#000000",
                                fontSize: "12px",
                                fontFamily: mono,
                                fontWeight: 600,
                                textDecoration: "none",
                                letterSpacing: "0.04em",
                                border: "1px solid #ffffff",
                              }}
                            >
                              Vote on slots →
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p
                      style={{
                        marginTop: "10px",
                        marginBottom: 0,
                        fontSize: "10px",
                        color: "#666666",
                        fontFamily: mono,
                      }}
                    >
                      Or open this link:{" "}
                      <a
                        href={voteUrl}
                        style={{
                          color: "#888888",
                          textDecoration: "underline",
                        }}
                      >
                        {voteUrl}
                      </a>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td
                    style={{
                      borderTop: "1px solid #1f1f1f",
                      backgroundColor: "#080808",
                      padding: "14px 20px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "10px",
                        color: "#555555",
                        fontFamily: mono,
                      }}
                    >
                      Sent on behalf of {organizerName} via Invitely.gg
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
