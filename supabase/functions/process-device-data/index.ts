import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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
    const data = await req.text();

    const plistBegin = '<?xml version="1.0"';
    const plistEnd = '</plist>';

    const pos1 = data.indexOf(plistBegin);
    const pos2 = data.indexOf(plistEnd);

    if (pos1 === -1 || pos2 === -1) {
      return new Response(
        JSON.stringify({ error: "Invalid plist data" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const xmlData = data.substring(pos1, pos2 + plistEnd.length);

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");

    const keys = xmlDoc.getElementsByTagName("key");
    const values = xmlDoc.getElementsByTagName("string");

    const deviceData: Record<string, string> = {};

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i].textContent;
      if (key && values[i]) {
        deviceData[key] = values[i].textContent || "";
      }
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: existingDevice } = await supabase
      .from("devices")
      .select("id")
      .eq("udid", deviceData.UDID)
      .maybeSingle();

    let deviceId: string;

    if (existingDevice) {
      const { data: updatedDevice, error } = await supabase
        .from("devices")
        .update({
          device_name: deviceData.DEVICE_NAME || "",
          device_product: deviceData.PRODUCT || "",
          device_version: deviceData.VERSION || "",
          mac_address: deviceData.MAC_ADDRESS_EN0 || "",
          imei: deviceData.IMEI || "",
          iccid: deviceData.ICCID || "",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingDevice.id)
        .select("id")
        .single();

      if (error) throw error;
      deviceId = updatedDevice.id;
    } else {
      const { data: newDevice, error } = await supabase
        .from("devices")
        .insert({
          udid: deviceData.UDID || "",
          device_name: deviceData.DEVICE_NAME || "",
          device_product: deviceData.PRODUCT || "",
          device_version: deviceData.VERSION || "",
          mac_address: deviceData.MAC_ADDRESS_EN0 || "",
          imei: deviceData.IMEI || "",
          iccid: deviceData.ICCID || "",
        })
        .select("id")
        .single();

      if (error) throw error;
      deviceId = newDevice.id;
    }

    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const redirectUrl = `${baseUrl}/device/${deviceId}`;

    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: redirectUrl,
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
