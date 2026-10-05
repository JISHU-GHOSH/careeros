import { NextResponse } from "next/server";

export const runtime = "edge";

const POPULAR_PROFESSIONS = [
  "Game Developer",
  "Cybersecurity Analyst",
  "Artificial Intelligence Engineer",
  "Commercial Airline Pilot",
  "Full-Stack Web Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Medical Doctor",
  "Product Manager",
  "Robotics Engineer",
  "Executive Chef",
  "Aerospace Engineer",
];

export async function GET() {
  return NextResponse.json(POPULAR_PROFESSIONS);
}
