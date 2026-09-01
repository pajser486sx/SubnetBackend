import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/explain", async (req, res) => {
  try {
    const {
      ipAddress,
      cidr,
      results
    } = req.body;

    if (
      !ipAddress || cidr === undefined || cidr === null || !results){
      return res.status(400).json({
        message: "Subnet calculation data is required"
      });
    }

    const subnetData = {
      ipAddress,
      cidr,
      subnetMask: results.subnetMask,
      networkAddress: results.networkAddress,
      broadcastAddress: results.broadcastAddress,
      firstUsableHost: results.firstUsableHost,
      lastUsableHost: results.lastUsableHost,
      totalAddresses: results.totalAddresses,
      usableHosts: results.usableHosts
    };

    const response =
      await openai.responses.create({
        model:
          process.env.OPENAI_MODEL ||
          "gpt-5.6-luna",

        instructions: `
You are a computer networking tutor.

Explain an IPv4 subnet calculation to a student.

The subnet calculation has already been performed by the application.
Treat the supplied calculation values as authoritative.

Explain:
- what the subnet mask means
- what the network address represents
- what the broadcast address represents
- the usable host range
- the total number of addresses
- the number of usable hosts
- what the CIDR prefix means

Use clear educational language.
Do not unnecessarily recalculate or replace the supplied values.
If a value such as a usable host is unavailable, explain why.
Keep the explanation concise but useful.
        `,

        input: `
Explain this subnet calculation:
${JSON.stringify(
  subnetData,
  null,
  2
)}
        `,
        max_output_tokens: 700
      });

    return res.json({
      explanation:
        response.output_text
    });

  } catch (error) {
    console.error(
      "AI explanation error:",
      error
    );
    return res.status(500).json({
      message:
        "Unable to generate the AI explanation..."
    });
  }

});

export default router