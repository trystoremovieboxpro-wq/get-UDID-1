const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const mobileConfig = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <dict>
        <key>URL</key>
        <string>${baseUrl}/functions/v1/process-device-data</string>
        <key>DeviceAttributes</key>
        <array>
            <string>UDID</string>
            <string>DEVICE_NAME</string>
            <string>VERSION</string>
            <string>PRODUCT</string>
            <string>MAC_ADDRESS_EN0</string>
            <string>IMEI</string>
            <string>ICCID</string>
        </array>
    </dict>
    <key>PayloadOrganization</key>
    <string>UDID Retriever</string>
    <key>PayloadDisplayName</key>
    <string>Device Information (UDID)</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
    <key>PayloadUUID</key>
    <string>BDD0F593-5B98-47FF-A0A4-4B98E30CE451</string>
    <key>PayloadIdentifier</key>
    <string>com.udidretriever.profile</string>
    <key>PayloadDescription</key>
    <string>Install this profile to retrieve your device UDID</string>
    <key>PayloadType</key>
    <string>Profile Service</string>
</dict>
</plist>`;

    return new Response(mobileConfig, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/x-apple-aspen-config; charset=utf-8",
        "Content-Disposition": 'attachment; filename="device.mobileconfig"',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
