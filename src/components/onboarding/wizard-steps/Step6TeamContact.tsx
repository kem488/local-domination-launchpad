import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, User, Mail, Phone } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  email: string;
  phone: string;
  is_primary_contact: boolean;
}

interface Step6TeamContactProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step6TeamContact = ({ data, onDataChange, onNext, onPrevious }: Step6TeamContactProps) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(data.team_members || []);
  const [newMember, setNewMember] = useState<TeamMember>({
    name: "",
    role: "",
    email: "",
    phone: "",
    is_primary_contact: false
  });

  const roles = [
    "Owner/Manager",
    "Office Manager",
    "Marketing Coordinator",
    "Operations Manager", 
    "Customer Service",
    "Technician/Field Worker",
    "Accountant/Bookkeeper",
    "Other"
  ];

  const contactMethods = [
    { id: "email", label: "Email", icon: Mail },
    { id: "phone", label: "Phone", icon: Phone },
    { id: "both", label: "Both Email & Phone", icon: User }
  ];

  const addTeamMember = () => {
    if (newMember.name && newMember.role) {
      const updatedMembers = [...teamMembers, { ...newMember }];
      setTeamMembers(updatedMembers);
      onDataChange({ ...data, team_members: updatedMembers });
      setNewMember({
        name: "",
        role: "",
        email: "",
        phone: "",
        is_primary_contact: false
      });
    }
  };

  const removeTeamMember = (index: number) => {
    const updatedMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updatedMembers);
    onDataChange({ ...data, team_members: updatedMembers });
  };

  const setPrimaryContact = (index: number) => {
    const updatedMembers = teamMembers.map((member, i) => ({
      ...member,
      is_primary_contact: i === index
    }));
    setTeamMembers(updatedMembers);
    onDataChange({ ...data, team_members: updatedMembers });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 6: Team & Contact Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Team Members (Optional)</Label>
          <p className="text-sm text-muted-foreground mb-4">
            Add team members who should have access to reports and updates
          </p>
          
          {/* Existing team members */}
          {teamMembers.length > 0 && (
            <div className="space-y-3 mb-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.name}</span>
                      <Badge variant="outline">{member.role}</Badge>
                      {member.is_primary_contact && (
                        <Badge variant="secondary">Primary Contact</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {member.email} {member.phone && `• ${member.phone}`}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!member.is_primary_contact && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPrimaryContact(index)}
                      >
                        Set Primary
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeTeamMember(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add new team member */}
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-medium">Add Team Member</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="member-name">Name</Label>
                <Input
                  id="member-name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Team member name"
                />
              </div>
              <div>
                <Label htmlFor="member-role">Role</Label>
                <Select
                  value={newMember.role}
                  onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="member-email">Email</Label>
                <Input
                  id="member-email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="member-phone">Phone (Optional)</Label>
                <Input
                  id="member-phone"
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  placeholder="01234 567890"
                />
              </div>
            </div>
            <Button
              type="button"
              onClick={addTeamMember}
              disabled={!newMember.name || !newMember.role}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Preferred Contact Method</Label>
          <p className="text-sm text-muted-foreground mb-4">
            How would you prefer us to contact you for updates and support?
          </p>
          <RadioGroup
            value={data.preferred_contact_method || "email"}
            onValueChange={(value) => onDataChange({ ...data, preferred_contact_method: value })}
          >
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div key={method.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {method.label}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base font-medium">Annual Revenue Range (Optional)</Label>
          <p className="text-sm text-muted-foreground mb-3">
            This helps us provide more targeted recommendations
          </p>
          <Select
            value={data.annual_revenue_range || ""}
            onValueChange={(value) => onDataChange({ ...data, annual_revenue_range: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select revenue range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-50k">Under £50,000</SelectItem>
              <SelectItem value="50k-100k">£50,000 - £100,000</SelectItem>
              <SelectItem value="100k-250k">£100,000 - £250,000</SelectItem>
              <SelectItem value="250k-500k">£250,000 - £500,000</SelectItem>
              <SelectItem value="500k-1m">£500,000 - £1,000,000</SelectItem>
              <SelectItem value="over-1m">Over £1,000,000</SelectItem>
              <SelectItem value="prefer-not-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button onClick={onNext}>
            Review & Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
