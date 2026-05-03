"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Trash2, ExternalLink, Calendar, Target, Activity, RefreshCw, User, Mail, Phone, Edit2, X, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface InterviewRow {
  id: string;
  created_at: string;
  overall_score: number;
  role_target: string | null;
}

// Singleton client — created once outside the component to prevent re-render loops
const supabase = createClient();

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [interviews, setInterviews] = useState<InterviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [editContactNo, setEditContactNo] = useState("");

  const fetchInterviews = useCallback(async (userId: string) => {
    setFetchError(null);
    const { data, error } = await supabase
      .from("interviews")
      .select("id, created_at, overall_score, role_target")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Profile] Supabase fetch error:", error);
      setFetchError(error.message);
      return;
    }
    setInterviews(data ?? []);
  }, []);

  useEffect(() => {
    async function init() {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      setUser(user);
      setEditName(user.user_metadata?.full_name || "");
      setEditAvatarUrl(user.user_metadata?.avatar_url || "");
      setEditContactNo(user.user_metadata?.contact_no || "");
      await fetchInterviews(user.id);
      setLoading(false);
    }
    init();
  }, [router, fetchInterviews]);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    const { data: { user: updatedUser }, error } = await supabase.auth.updateUser({
      data: {
        full_name: editName,
        avatar_url: editAvatarUrl,
        contact_no: editContactNo,
      }
    });

    if (error) {
      alert("Failed to update profile: " + error.message);
    } else {
      setUser(updatedUser);
      setIsEditingProfile(false);
    }
    setIsSavingProfile(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this interview record? This cannot be undone.")) return;
    // Optimistic UI — remove immediately
    setInterviews((prev) => prev.filter((item) => item.id !== id));
    const { error } = await supabase.from("interviews").delete().eq("id", id);
    if (error) {
      alert("Delete failed: " + error.message);
      // Re-fetch to restore accurate state
      if (user) fetchInterviews(user.id);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex justify-center items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span>Loading your profile...</span>
        </main>
      </div>
    );
  }

  const getScoreStyle = (score: number) => {
    if (score >= 75) return { ring: "border-green-500/40 shadow-green-500/10", badge: "text-green-500 bg-green-500/10" };
    if (score >= 50) return { ring: "border-yellow-500/40 shadow-yellow-500/10", badge: "text-yellow-500 bg-yellow-500/10" };
    return { ring: "border-red-500/40 shadow-red-500/10", badge: "text-red-500 bg-red-500/10" };
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-background shadow-md overflow-hidden flex-shrink-0 flex items-center justify-center text-primary">
              {user?.user_metadata?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>
            
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-1">
              <h1 className="text-3xl font-heading font-bold mb-2">
                {user?.user_metadata?.full_name || "New Candidate"}
              </h1>
              
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2 justify-center sm:justify-start">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse ml-1" title="Online" />
                </p>
                {user?.user_metadata?.contact_no && (
                  <p className="flex items-center gap-2 justify-center sm:justify-start">
                    <Phone className="w-4 h-4" />
                    {user.user_metadata.contact_no}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto gap-2" onClick={() => setIsEditingProfile(true)}>
              <Edit2 className="w-4 h-4" /> Edit Profile
            </Button>
            <Link href="/analyze" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto shadow-lg shadow-primary/20">+ New Analysis</Button>
            </Link>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <Card className="w-full max-w-md p-6 shadow-xl border-primary/20 relative animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-heading">Edit Profile</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsEditingProfile(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Full Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Contact Number</label>
                  <input 
                    type="tel" 
                    value={editContactNo}
                    onChange={(e) => setEditContactNo(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. +1 234 567 890"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Profile Picture URL</label>
                  <input 
                    type="url" 
                    value={editAvatarUrl}
                    onChange={(e) => setEditAvatarUrl(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="https://example.com/my-photo.jpg"
                  />
                  <p className="text-xs text-muted-foreground">Paste a direct link to an image (e.g., from LinkedIn or Imgur).</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                  {isSavingProfile ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Section heading */}
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground/80">
          <Activity className="w-5 h-5 text-primary" />
          Interview History
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-7 w-7 text-muted-foreground"
            onClick={() => user && fetchInterviews(user.id)}
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </h2>

        {/* Error state */}
        {fetchError && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            <strong>Failed to load history:</strong> {fetchError}
            <br />
            <span className="text-xs text-muted-foreground mt-1 block">Check that the <code>interviews</code> table exists in your Supabase project and Row Level Security is enabled.</span>
          </div>
        )}

        {/* Empty state */}
        {!fetchError && interviews.length === 0 && (
          <div className="border-2 border-dashed border-muted-foreground/20 rounded-2xl p-16 text-center bg-muted/5">
            <Target className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-xl font-bold mb-2">No interviews yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-balance text-sm">
              Analyze a recording and it will appear here automatically for you to revisit anytime.
            </p>
            <Link href="/analyze">
              <Button className="shadow-lg shadow-primary/20">Start Your First Analysis</Button>
            </Link>
          </div>
        )}

        {/* History grid */}
        {interviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {interviews.map((interview) => {
              const style = getScoreStyle(interview.overall_score);
              return (
                <Card
                  key={interview.id}
                  className={`p-6 bg-card border transition-all duration-200 hover:shadow-lg ${style.ring}`}
                >
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base capitalize truncate">
                        {interview.role_target ?? "Interview Analysis"}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3 shrink-0" />
                        {new Date(interview.created_at).toLocaleDateString(undefined, {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className={`ml-3 w-13 h-13 min-w-[52px] min-h-[52px] rounded-full flex items-center justify-center font-bold text-lg font-heading ${style.badge}`}>
                      {interview.overall_score}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-background/60 hover:bg-muted text-xs"
                      onClick={() => router.push(`/results/${interview.id}`)}
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> View Report
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0"
                      onClick={() => handleDelete(interview.id)}
                      title="Delete this record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
