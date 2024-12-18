"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Check, Copy, Eye, EyeOff, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerCase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "@#$%^&*()_+~|}{[]></-=";
const allCharacters = upperCase + lowerCase + numbers + symbols;

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [length, setLength] = useState(12);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const createPassword = () => {
    let newPassword = "";
    newPassword += upperCase[Math.floor(Math.random() * upperCase.length)];
    newPassword += lowerCase[Math.floor(Math.random() * lowerCase.length)];
    newPassword += numbers[Math.floor(Math.random() * numbers.length)];
    newPassword += symbols[Math.floor(Math.random() * symbols.length)];

    while (newPassword.length < length) {
      newPassword +=
        allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }

    setPassword(newPassword);
  };

  const copyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      alert("Password copied to clipboard!");
    }
  };

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
      {
        regex: /[!@#$%^&*()_+~|}{[\]></-=]/,
        text: "At least 1 special character",
      },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 2) return "bg-red-500";
    if (score <= 3) return "bg-orange-500";
    if (score === 4) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score <= 3) return "Medium password";
    if (score === 4) return "Strong password";
    return "Very strong password";
  };

  const max = 32;
  const min = 8;
  const skipInterval = 4;
  const ticks = [...Array(max - min + 1)].map((_, i) => i + min);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password">Generated Password</Label>
        <div className="relative">
          <Input
            id="password"
            className="pr-20"
            type={isVisible ? "text" : "password"}
            value={password}
            readOnly
            aria-describedby="password-strength"
          />
          <div className="absolute inset-y-0 right-0 flex">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-full"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
            >
              {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-full"
              onClick={copyPassword}
              aria-label="Copy password"
            >
              <Copy size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="length-slider">Password Length: {length}</Label>
        <Slider
          id="length-slider"
          min={min}
          max={max}
          step={1}
          value={[length]}
          onValueChange={(value) => setLength(value[0] ?? length)}
          aria-label="Password length"
        />
        <span
          className="flex w-full items-center justify-between gap-1 px-2.5 text-xs font-medium text-muted-foreground"
          aria-hidden="true"
        >
          {ticks.map((tick, i) => (
            <span
              key={i}
              className="flex w-0 flex-col items-center justify-center gap-2"
            >
              <span
                className={cn(
                  "h-1 w-px bg-muted-foreground/70",
                  i % skipInterval !== 0 && "h-0.5",
                )}
              />
              <span className={cn(i % skipInterval !== 0 && "opacity-0")}>
                {tick}
              </span>
            </span>
          ))}
        </span>
      </div>

      <Button onClick={createPassword} className="w-full">
        <RefreshCw size={16} className="mr-2" />
        Generate Password
      </Button>

      <div
        className="h-1 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={5}
        aria-label="Password strength"
      >
        <div
          className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 5) * 100}%` }}
        ></div>
      </div>

      <p id="password-strength" className="text-sm font-medium text-foreground">
        {getStrengthText(strengthScore)}. Must contain:
      </p>

      <ul className="space-y-1.5" aria-label="Password requirements">
        {strength.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {req.met ? (
              <Check
                size={16}
                className="text-emerald-500"
                aria-hidden="true"
              />
            ) : (
              <X
                size={16}
                className="text-muted-foreground/80"
                aria-hidden="true"
              />
            )}
            <span
              className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
            >
              {req.text}
              <span className="sr-only">
                {req.met ? " - Requirement met" : " - Requirement not met"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
