import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Upload, Building2, User, CheckCircle2 } from 'lucide-react';

export const PartnerRegistrationModal: React.FC = () => {
  const {
    partnerModalOpen,
    setPartnerModalOpen,
    activePartnerType,
    setActivePartnerType,
    registerNursery,
    registerGardener,
    currentUser
  } = useApp();

  const [submitted, setSubmitted] = useState(false);

  // Nursery fields
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState(currentUser.name || '');
  const [city, setCity] = useState(currentUser.city || 'Bengaluru');
  const [location, setLocation] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [establishedYear, setEstablishedYear] = useState(2020);
  const [description, setDescription] = useState('');

  // Gardener fields
  const [fullName, setFullName] = useState(currentUser.name || '');
  const [experienceYears, setExperienceYears] = useState(5);
  const [hourlyRate, setHourlyRate] = useState(499);
  const [specialties, setSpecialties] = useState('Balcony Garden Setup, Organic Pruning, Plant Doctor');
  const [serviceAreas, setServiceAreas] = useState('South City, Indiranagar, Koramangala');
  const [certificateName, setCertificateName] = useState('NHB Certified Horticulturist');
  const [bio, setBio] = useState('');

  if (!partnerModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activePartnerType === 'nursery') {
      registerNursery({
        userId: currentUser.id,
        businessName: businessName || 'Green Haven Nursery',
        ownerName: ownerName || currentUser.name,
        location: location || 'Horticulture Corridor',
        city,
        licenseNumber: licenseNumber || `KA-${Date.now().toString().slice(-4)}`,
        establishedYear: Number(establishedYear) || 2021,
        description: description || 'Specializing in acclimatized indoor foliage and native blooms.',
        image: '/assets/aistudio/image_f9900427.png'
      });
    } else {
      registerGardener({
        userId: currentUser.id,
        fullName: fullName || currentUser.name,
        experienceYears: Number(experienceYears) || 5,
        hourlyRate: Number(hourlyRate) || 499,
        specialties: specialties.split(',').map(s => s.trim()),
        serviceAreas: serviceAreas.split(',').map(s => s.trim()),
        bio: bio || 'Certified master gardener dedicated to reviving urban spaces with natural care.',
        certificateName: certificateName || 'National Horticulture Board Certification',
        avatar: '/assets/heroes/gardener_service_hero.jpg',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      });
    }

    setSubmitted(true);
  };

  const handleClose = () => {
    setPartnerModalOpen(false);
    setSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl overflow-hidden border border-white/80 shadow-2xl p-6 sm:p-8 bg-white my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-700" />
            </div>

            <h3 className="text-2xl font-bold text-stone-900 font-serif-botanical">
              Application Submitted!
            </h3>

            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
              Your partner registration dossier has been submitted to the <strong>Admin Verification Queue</strong>. Once documents are verified, your Verified Partner badge will be activated.
            </p>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 max-w-sm mx-auto">
              <p className="font-semibold text-stone-800">Verification Timeline:</p>
              <p className="mt-1">Usually reviewed within 24 hours by chief horticulturist.</p>
            </div>

            <button
              onClick={handleClose}
              className="py-3 px-6 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Back to Marketplace
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Partner Onboarding</span>
              </div>
              <h2 className="text-2xl font-bold text-stone-900 font-serif-botanical">
                Join the Urbano Partner Network
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Register your nursery greenhouse or gardening credentials to offer services to thousands of verified plant lovers.
              </p>
            </div>

            {/* Partner Role Selector */}
            <div className="grid grid-cols-2 gap-3 p-1 bg-stone-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setActivePartnerType('nursery')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activePartnerType === 'nursery'
                    ? 'bg-white text-emerald-950 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Nursery Grower</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePartnerType('gardener')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activePartnerType === 'gardener'
                    ? 'bg-white text-emerald-950 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <User className="w-4 h-4 text-emerald-700" />
                <span>Gardener Specialist</span>
              </button>
            </div>

            {/* Nursery Fields */}
            {activePartnerType === 'nursery' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-800 block mb-1">
                      Nursery Business Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FloraCraft Botanics"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-800 block mb-1">
                      Proprietor / Owner Name
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-800 block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-800 block mb-1">
                      Location / Corridor
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarjapur Corridor"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-800 block mb-1">
                      Horticulture License #
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. KA-BNG-HORT-2024"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">
                    Greenhouse Specialties & Bio
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe your plant propagation specialties, soil mixes, and greenhouses..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700 resize-none"
                  />
                </div>
              </div>
            ) : (
              /* Gardener Fields */
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-stone-800 block mb-1">
                      Specialist Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-800 block mb-1">
                      Years Experience
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      required
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-800 block mb-1">
                      Hourly Rate (in ₹)
                    </label>
                    <input
                      type="number"
                      min="200"
                      max="3000"
                      step="50"
                      required
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-800 block mb-1">
                      Accreditation / Certificate Name
                    </label>
                    <input
                      type="text"
                      required
                      value={certificateName}
                      onChange={(e) => setCertificateName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">
                    Specialties (comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={specialties}
                    onChange={(e) => setSpecialties(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">
                    Service Areas Covered (comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceAreas}
                    onChange={(e) => setServiceAreas(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">
                    Professional Biography
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your horticulture mastery, notable projects, and approach..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Document Upload Simulation */}
            <div className="p-3.5 border border-dashed border-stone-300 rounded-2xl bg-stone-50/70 text-center">
              <Upload className="w-5 h-5 mx-auto text-stone-400 mb-1" />
              <p className="text-xs font-medium text-stone-700">
                Government ID & Horticulture Accreditation Document
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">
                PDF, JPG or PNG (Simulated Document Attachment Attached: NHB_Verified_Doc.pdf)
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Submit for Admin Verification
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
