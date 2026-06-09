"use client";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import type { UserProfile } from "@/types";

interface ProfileFormProps {
  profile: UserProfile | null | undefined;
  onSave: (data: Partial<UserProfile>) => Promise<void>;
  isLoading: boolean;
}

export function ProfileForm({ profile, onSave, isLoading }: ProfileFormProps) {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [seniority, setSeniority] = useState("");
  const [yearsExp, setYearsExp] = useState("");
  const [preferredRoles, setPreferredRoles] = useState<string[]>([]);
  const [roleInput, setRoleInput] = useState("");
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [background, setBackground] = useState("");
  const [currentGoal, setCurrentGoal] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setSkills(profile.skills ?? []);
      setSeniority(profile.seniority ?? "");
      setYearsExp(String(profile.years_experience ?? ""));
      setPreferredRoles(profile.preferred_roles ?? []);
      setPreferredLocations(profile.preferred_locations ?? []);
      setBackground(profile.background ?? "");
      setCurrentGoal(profile.current_goal ?? "");
    }
  }, [profile]);

  const addItems = (
    input: string,
    current: string[],
    setter: (v: string[]) => void,
    clearInput: () => void,
  ) => {
    const items = input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (items.length === 0) return;
    const merged = new Set([...current, ...items]);
    setter(Array.from(merged));
    clearInput();
  };

  const addSkill = () => addItems(skillInput, skills, setSkills, () => setSkillInput(""));
  const addRole = () => addItems(roleInput, preferredRoles, setPreferredRoles, () => setRoleInput(""));
  const addLocation = () => addItems(locationInput, preferredLocations, setPreferredLocations, () => setLocationInput(""));

  const removeSkill = (s: string) => setSkills(skills.filter((x) => x !== s));
  const removeRole = (r: string) => setPreferredRoles(preferredRoles.filter((x) => x !== r));
  const removeLocation = (l: string) => setPreferredLocations(preferredLocations.filter((x) => x !== l));

  const handleKeyDown = (
    e: React.KeyboardEvent,
    addFn: () => void,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFn();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (skills.length === 0) {
      toast({ title: "Skills required", description: "Add at least one skill", variant: "destructive" });
      return;
    }
    if (!seniority) {
      toast({ title: "Seniority required", description: "Select your seniority level", variant: "destructive" });
      return;
    }
    if (preferredRoles.length === 0) {
      toast({ title: "Roles required", description: "Add at least one preferred role", variant: "destructive" });
      return;
    }
    if (preferredLocations.length === 0) {
      toast({ title: "Locations required", description: "Add at least one preferred location", variant: "destructive" });
      return;
    }
    const data: Partial<UserProfile> = {
      skills,
      seniority,
      years_experience: parseInt(yearsExp) || 0,
      preferred_roles: preferredRoles,
      preferred_locations: preferredLocations,
      background,
      current_goal: currentGoal,
    };
    console.log("[ProfileForm] Submitting payload:", JSON.stringify(data, null, 2));
    await onSave(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
    toast({
      title: "Profile updated",
      description: "Your profile has been saved",
      variant: "success",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {saved && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Profile saved successfully
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Skills & Experience</CardTitle>
          <CardDescription>
            Add your technical skills and professional background
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-1 mb-2">
              {skills.map((s) => (
                <Badge key={s} variant="secondary" className="gap-1">
                  {s}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeSkill(s)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add skills (comma separated)..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, addSkill)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addSkill}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seniority">Seniority</Label>
              <select
                id="seniority"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="years">Years of experience</Label>
              <Input
                id="years"
                type="number"
                min="0"
                placeholder="0"
                value={yearsExp}
                onChange={(e) => setYearsExp(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            What kind of roles and locations are you looking for?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred roles</Label>
            <div className="flex flex-wrap gap-1 mb-2">
              {preferredRoles.map((r) => (
                <Badge key={r} variant="secondary" className="gap-1">
                  {r}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeRole(r)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add roles (comma separated)..."
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, addRole)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addRole}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preferred locations</Label>
            <div className="flex flex-wrap gap-1 mb-2">
              {preferredLocations.map((l) => (
                <Badge key={l} variant="secondary" className="gap-1">
                  {l}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeLocation(l)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add locations (comma separated)..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, addLocation)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addLocation}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Background & Goals</CardTitle>
          <CardDescription>
            Tell us about your experience and what you&apos;re looking for
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="background">Professional background</Label>
            <Textarea
              id="background"
              placeholder="Brief summary of your experience..."
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal">Current goal</Label>
            <Textarea
              id="goal"
              placeholder="What are you looking for in your next role?"
              value={currentGoal}
              onChange={(e) => setCurrentGoal(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
}
