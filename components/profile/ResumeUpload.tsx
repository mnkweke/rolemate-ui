"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import type { UserProfile } from "@/types";

interface ResumeUploadProps {
  onUpload: (file: File) => Promise<void>;
  extractedProfile: UserProfile | null | undefined;
  isLoading: boolean;
}

export function ResumeUpload({
  onUpload,
  extractedProfile,
  isLoading,
}: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setUploaded(false);
        setShowSuccess(false);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleUpload = async () => {
    if (!file) return;
    try {
      await onUpload(file);
      setUploaded(true);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      toast({
        title: "Resume parsed",
        description: "Your profile has been extracted",
        variant: "success",
      });
    } catch {
      toast({
        title: "Upload failed",
        description: "Could not parse resume",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Profile saved successfully
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload Resume</CardTitle>
          <CardDescription>
            Upload a PDF or Word document to automatically extract your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              {isDragActive ? (
                <>
                  <Upload className="h-10 w-10 text-primary animate-bounce" />
                  <p className="text-sm font-medium">Drop your file here</p>
                </>
              ) : (
                <>
                  <FileText className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Drag & drop your resume here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF or DOCX, max 10MB
                  </p>
                </>
              )}
            </div>
          </div>

          {file && (
            <div className="mt-4 flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>
              {uploaded ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <Button
                  size="sm"
                  onClick={handleUpload}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Parsing...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {extractedProfile && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Profile</CardTitle>
            <CardDescription>
              Profile parsed from your resume
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {extractedProfile.skills?.map((s) => (
                  <Badge key={s} variant="secondary">
                    {s}
                  </Badge>
                )) ?? (
                  <p className="text-sm text-muted-foreground">
                    No skills extracted
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Seniority</h4>
                <p className="text-sm text-muted-foreground">
                  {extractedProfile.seniority || "Not specified"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">
                  Years of experience
                </h4>
                <p className="text-sm text-muted-foreground">
                  {extractedProfile.years_experience ?? "Not specified"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">
                Preferred roles
              </h4>
              <div className="flex flex-wrap gap-1">
                {extractedProfile.preferred_roles?.map((r) => (
                  <Badge key={r} variant="secondary">
                    {r}
                  </Badge>
                )) ?? (
                  <p className="text-sm text-muted-foreground">
                    No roles extracted
                  </p>
                )}
              </div>
            </div>

            {extractedProfile.background && (
              <div>
                <h4 className="text-sm font-medium mb-1">Background</h4>
                <p className="text-sm text-muted-foreground">
                  {extractedProfile.background}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-green-400">
              <CheckCircle className="h-4 w-4" />
              Profile extracted successfully
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
