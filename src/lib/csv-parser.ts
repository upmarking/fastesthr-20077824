export interface BulkCandidate {
  full_name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  experience?: string;
  location?: string;
  education?: string;
}

export function parseCandidatesCSV(csvText: string): BulkCandidate[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const headerMap: Record<string, number> = {};
  
  headers.forEach((header, index) => {
    headerMap[header] = index;
  });

  // Required headers: Name, Email
  if (!headerMap['name'] || !headerMap['email']) {
    // Basic mapping: 0 -> name, 1 -> email
    // But let's be more flexible
  }

  const result: BulkCandidate[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length < 2) continue;

    const candidate: BulkCandidate = {
      full_name: values[headerMap['name']] || values[0],
      email: values[headerMap['email']] || values[1],
      phone: values[headerMap['phone']],
      linkedin: values[headerMap['linkedin']],
      experience: values[headerMap['experience']],
      location: values[headerMap['location']],
      education: values[headerMap['education']],
    };

    if (candidate.full_name && candidate.email) {
      result.push(candidate);
    }
  }

  return result;
}

export function generateSampleCSV(): string {
  return "Name, Email, Phone, Linkedin, Experience, Location, Education\nJohn Doe, john@example.com, +1234567890, https://linkedin.com/in/johndoe, 5 years, New York, B.Tech CS";
}
