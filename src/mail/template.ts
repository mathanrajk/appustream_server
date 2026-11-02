interface Options {
  title: string;
  message: string;
  link: string;
  btnTitle: string;
}

export const generateTemplate = ({
  title,
  message,
  link,
  btnTitle,
}: Options) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f4f4f7;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background-color: #f4f4f7; padding: 24px 0"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="max-width: 520px; background-color: #ffffff; border-radius: 8px"
          >
            <tr>
              <td style="padding: 32px">
                <h1
                  style="
                    margin: 0 0 16px;
                    font-size: 22px;
                    color: #101010;
                    text-align: center;
                  "
                >
                  ${title}
                </h1>
                <p
                  style="
                    margin: 0 0 24px;
                    font-size: 15px;
                    line-height: 1.6;
                    color: #444444;
                    text-align: center;
                  "
                >
                  ${message}
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" align="center">
                  <tr>
                    <td
                      style="
                        background-color: #101010;
                        border-radius: 4px;
                        text-align: center;
                      "
                    >
                      <a
                        href="${link}"
                        style="
                          display: inline-block;
                          padding: 12px 28px;
                          color: #ffffff;
                          text-decoration: none;
                          font-size: 16px;
                        "
                        >${btnTitle}</a
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <p
            style="margin: 16px 0 0; font-size: 12px; color: #999999; text-align: center"
          >
            Tunexa
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
