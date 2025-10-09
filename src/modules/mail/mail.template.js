export const getVerifyTemplateMail = ({ email, link }) => {
  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <title>Xác thực tài khoản — GOTICKET</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      body,
      table,
      td,
      a {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      table,
      td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      img {
        -ms-interpolation-mode: bicubic;
      }
      body {
        margin: 0;
        padding: 0;
        width: 100% !important;
        height: 100% !important;
        background-color: #f3faf6;
        font-family: "Helvetica Neue", Arial, sans-serif;
      }
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }

      /* Container */
      .email-wrapper {
        width: 100%;
        background-color: #f3faf6;
        padding: 24px 0;
      }

      /* Card */
      .email-content {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 6px 18px rgba(20, 60, 20, 0.06);
      }

      /* Header */
      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 28px 32px 12px 32px;
      }
      .logo-badge {
        padding: 16px 24px;
        border-radius: 12px;
        background: linear-gradient(135deg, #1fbf4a, #0ea14c);
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #fff;
        font-weight: 700;
        font-size: 20px;
        letter-spacing: 1px;
        margin-right: 10px;
        box-shadow: 0 3px 10px rgba(14, 161, 76, 0.18);
      }
      .brand h1 {
        margin: 0;
        font-size: 20px;
        color: #0b3b2b;
      }

      /* Body */
      .email-body {
        padding: 18px 32px 32px 32px;
        color: #163a2b;
        line-height: 1.6;
      }
      .headline {
        font-size: 20px;
        font-weight: 700;
        margin: 0 0 8px 0;
        color: #0b3b2b;
      }
      .muted {
        color: #557a69;
        font-size: 14px;
      }

      /* Button */
      .btn {
        display: inline-block;
        padding: 14px 22px;
        border-radius: 10px;
        background: linear-gradient(180deg, #25b84a, #0e9b43);
        color: #fff;
        text-decoration: none;
        font-weight: 700;
        box-shadow: 0 6px 18px rgba(14, 161, 76, 0.18);
        margin-top: 18px;
      }
      .small {
        font-size: 13px;
        color: #6b8b78;
        margin-top: 18px;
      }

      /* Footer */
      .email-footer {
        padding: 20px 32px;
        background: #f1fbf6;
        color: #5d7f6d;
        font-size: 13px;
        border-top: 1px solid rgba(11, 59, 43, 0.04);
      }
      .footer-links a {
        color: #0e9b43;
        text-decoration: none;
      }

      /* Responsive */
      @media only screen and (max-width: 420px) {
        .brand {
          padding: 20px;
          gap: 10px;
        }
        .email-body {
          padding: 16px 20px 24px 20px;
        }
        .email-footer {
          padding: 16px 20px;
        }
        .logo-badge {
          min-width: 46px;
          min-height: 46px;
          font-size: 18px;
        }
      }
    </style>
  </head>
  <body>
    <div
      style="
        display: none;
        max-height: 0;
        max-width: 0;
        overflow: hidden;
        font-size: 1px;
        color: #f3faf6;
        line-height: 1px;
        opacity: 0;
      "
    >
      Xác thực email của bạn để hoàn tất đăng ký tài khoản GOTICKET
    </div>

    <table
      role="presentation"
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      class="email-wrapper"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            class="email-content"
            style="max-width: 600px"
          >
            <tr>
              <td class="brand" style="padding: 28px 32px 12px 32px">
                <div class="logo-badge" aria-hidden="true">G</div>
                <div>
                  <h1 style="margin: 0; font-size: 20px; color: #0b3b2b">
                    GOTICKET
                  </h1>
                  <div style="font-size: 13px; color: #557a69; margin-top: 4px">
                    Nơi đặt vé nhanh chóng & an toàn
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td class="email-body" style="padding: 18px 32px 32px 32px">
                <p class="headline" style="margin: 0 0 8px 0">
                  Xác thực địa chỉ email của bạn
                </p>
                <p class="muted" style="margin: 0 0 16px 0">
                  Chào <strong>${email}</strong>, cảm ơn bạn đã đăng ký tài
                  khoản tại GOTICKET. Nhấn nút bên dưới để xác thực email và
                  hoàn tất quá trình đăng ký.
                </p>

                <!-- Button -->
                <p style="margin: 18px 0 0 0">
                  <a
                    href="${link}"
                    class="btn"
                    style="color: #fff"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Xác thực tài khoản</a
                  >
                </p>

                <!-- Secondary -->
                <p class="small" style="margin: 18px 0 0 0;">
                  Nếu nút trên không hoạt động, sao chép và dán liên kết sau vào
                  trình duyệt:
                  <br />
                  <a
                    href="${link}"
                    style="color: #0e9b43; word-break: break-all"
                    >${link}</a
                  >
                </p>

                <hr
                  style="
                    border: none;
                    border-top: 1px solid #eef7ef;
                    margin: 22px 0;
                  "
                />

                <p style="margin: 0; color: #557a69; font-size: 14px">
                  Lưu ý: Liên kết xác thực sẽ hết hạn sau
                  <strong style="color: red">24 giờ</strong>. Nếu bạn không đăng ký GOTICKET, hãy
                  bỏ qua email này.
                </p>
              </td>
            </tr>

            <tr>
              <td class="email-body" >
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                  "
                >
                  <div style="font-size: 13px; color: #4f7662">
                    GOTICKET — Đến là đón
                    <div style="margin-top: 8px; color: #6b8b78">
                      Email:
                      <a
                        href="mailto:support@goticket.com"
                        class="footer-links"
                        style="color: #0e9b43; text-decoration: none"
                        >support@goticket.com</a
                      >
                    </div>
                  </div>
                  <div
                    style="font-size: 12px; color: #6b8b78; text-align: right"
                  >
                    Nếu bạn cần trợ giúp, liên hệ chúng tôi.
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};
