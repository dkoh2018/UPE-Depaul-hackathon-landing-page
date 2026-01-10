import React, { useRef, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema } from '../lib/formSchema';
import { FORM_FIELDS, FORM_ACTION_URL, GRAD_YEAR_OPTIONS, TRACK_OPTIONS, TEAM_STATUS_OPTIONS, DIETARY_OPTIONS } from '../utils/formConfig';
import { Field, FieldLabel, FieldError, FieldDescription, Input, Select, RadioItem, CheckboxItem, Button } from './ui/Field';
import { Z_INDEX } from '../constants';

const RegistrationForm = () => {
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showAbout, setShowAbout] = useState(true);
    const [showForm, setShowForm] = useState(true);
    const [showHeader, setShowHeader] = useState(true);
    const [showNotice, setShowNotice] = useState(true);
    const iframeRef = useRef(null);
    
    const [teammates, setTeammates] = useState([
        { name: '', email: '', nameError: '' },
        { name: '', email: '', nameError: '' },
        { name: '', email: '', nameError: '' },
        { name: '', email: '', nameError: '' },
        { name: '', email: '', nameError: '' },
    ]);

    const sanitizeName = (name) => {
        return name.trim().replace(/\s+/g, ' ');
    };

    const sanitizeEmail = (email) => {
        return email.trim().toLowerCase();
    };

    const validateTeammateName = (name) => {
        if (!name) return '';
        const words = name.split(' ').filter(w => w.length > 0);
        if (words.length < 2) {
            return 'Please enter first and last name';
        }
        return '';
    };

    const form = useForm({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            fullName: '',
            email: '',
            gradYear: '',
            track: '',
            teamStatus: '',
            teammateDetails: '',
            dietaryRestrictions: [],
        },
        mode: 'onBlur',
    });

    useEffect(() => {
        const details = teammates
            .filter(t => t.name || t.email)
            .map(t => `${t.name} - ${t.email}`)
            .join('\n');
        form.setValue('teammateDetails', details);
    }, [teammates, form]);

    const updateTeammate = (index, field, value) => {
        setTeammates(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleTeammateBlur = (index, field) => {
        setTeammates(prev => {
            const updated = [...prev];
            if (field === 'name') {
                const sanitized = sanitizeName(updated[index].name);
                const error = validateTeammateName(sanitized);
                updated[index] = { ...updated[index], name: sanitized, nameError: error };
            } else if (field === 'email') {
                updated[index] = { ...updated[index], email: sanitizeEmail(updated[index].email) };
            }
            return updated;
        });
    };

    const handleIframeLoad = () => {
        if (submitting) {
            setSubmitted(true);
            setSubmitting(false);
        }
    };

    const onSubmit = () => {
        setSubmitting(true);
        setTimeout(() => {
            setSubmitted(true);
            setSubmitting(false);
        }, 2000);
        document.getElementById('google-form').submit();
    };

    if (submitted) {
        return (
            <div style={{ maxWidth: '590px', margin: '40px auto', padding: '0 16px', pointerEvents: 'none', position: 'relative', zIndex: Z_INDEX.FORM }}>
                <div className="standard-dialog" style={{ textAlign: 'center', padding: '40px 20px', marginBottom: '20px' }}>
                    <h1 className="font-unique" style={{ fontSize: 'clamp(50px, 12vw, 80px)', margin: 0, lineHeight: 1, letterSpacing: '5px' }}>
                        DEMONHACKS 2026
                    </h1>
                    <p style={{ marginTop: '12px', marginBottom: 0, fontSize: '14px' }}>
                        @ DePaul University • Feb 28 - Mar 1, 2026
                    </p>
                </div>

                <div className="window" style={{ pointerEvents: 'auto' }}>
                    <div className="title-bar">
                        <button aria-label="Close" className="close"></button>
                        <h1 className="title">Success</h1>
                        <button aria-label="Resize" disabled className="hidden"></button>
                    </div>
                    <div className="separator"></div>
                    <div className="window-pane" style={{ padding: '30px', textAlign: 'center' }}>
                        <p style={{ fontSize: '16px', marginBottom: '10px' }}>✓ Registration Complete!</p>
                        <p style={{ fontSize: '14px', color: '#666' }}>Thank you for registering for DemonHacks 2026.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>
                {`
                @media (max-width: 768px) {
                    .registration-form-wrapper {
                        max-width: 92% !important;
                    }
                }
                `}
            </style>
            <div className="registration-form-wrapper" style={{ 
                maxWidth: '590px', 
                margin: '0 auto', 
                padding: '20px 16px 60px 16px',
                position: 'relative',
                zIndex: Z_INDEX.FORM,
                pointerEvents: 'none',
            }}>
            <iframe 
                name="hidden_iframe" 
                ref={iframeRef}
                style={{ display: 'none' }} 
                onLoad={handleIframeLoad}
            />

            <form 
                id="google-form"
                action={FORM_ACTION_URL} 
                method="POST" 
                target="hidden_iframe"
                style={{ display: 'none' }}
            >
                <input type="hidden" name={FORM_FIELDS.fullName} value={form.watch('fullName')} />
                <input type="hidden" name={FORM_FIELDS.email} value={form.watch('email')} />
                <input type="hidden" name={FORM_FIELDS.gradYear} value={form.watch('gradYear')} />
                <input type="hidden" name={FORM_FIELDS.track} value={form.watch('track')} />
                <input type="hidden" name={FORM_FIELDS.teamStatus} value={form.watch('teamStatus')} />
                <input type="hidden" name={FORM_FIELDS.teammateDetails} value={form.watch('teammateDetails')} />
                {form.watch('dietaryRestrictions')?.map((diet, i) => (
                    <input key={i} type="hidden" name={FORM_FIELDS.dietaryRestrictions} value={diet} />
                ))}
            </form>

            {showHeader && (
                <div className="standard-dialog" style={{ position: 'relative', textAlign: 'center', padding: '40px 20px', marginBottom: '0', pointerEvents: 'auto' }}>
                    <button 
                        className="close"
                        onClick={() => setShowHeader(false)}
                        style={{
                            position: 'absolute',
                            top: '2px',
                            left: '8px',
                            zIndex: 10,
                            transformOrigin: 'top left',
                        }}
                        aria-label="Close header"
                    >
                    </button>
                    <h1 className="font-unique" style={{ fontSize: 'clamp(50px, 12vw, 80px)', margin: 0, lineHeight: 1, letterSpacing: '5px' }}>
                        DEMONHACKS 2026
                    </h1>
                    <p style={{ marginTop: '12px', marginBottom: 0, fontSize: '14px' }}>
                        @ DePaul University • Feb 28 - Mar 1, 2026
                    </p>
                <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '12px',
                    fontSize: '10px',
                    fontFamily: '"Courier New", monospace',
                    color: 'rgba(0,0,0,0.8)',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    <style>
                        {`
                        @keyframes pixel-blink {
                            0%, 100% { opacity: 0; transform: scale(0.5); }
                            50% { opacity: 1; transform: scale(1.2); }
                        }
                        `}
                    </style>
                    
                    <span style={{ 
                        color: '#333333', 
                        fontSize: '14px', 
                        fontWeight: 'bold',
                        animation: 'pixel-blink 1.2s infinite',
                        position: 'relative',
                        top: '-2px'
                    }}>+</span>

                    (yes, you can close the windows)

                    <span style={{ 
                        color: '#333333', 
                        fontSize: '12px', 
                        fontWeight: 'bold',
                        animation: 'pixel-blink 1.2s infinite 0.6s',
                        position: 'relative',
                        top: '-2px'
                    }}> +</span>
                </div>
            </div>
            )}

            {showAbout && (
                <div className="window" style={{ marginTop: showHeader ? '-2px' : '20px', marginBottom: '0', pointerEvents: 'auto', position: 'relative' }}>
                    <div className="title-bar">
                        <button 
                            aria-label="Close" 
                            className="close"
                            onClick={() => setShowAbout(false)}
                        ></button>
                        <h1 className="title">About the Event</h1>
                        <button aria-label="Resize" disabled className="hidden"></button>
                    </div>
                    <div className="separator"></div>
                    <div style={{ padding: '24px', background: '#fff' }}>
                        <p style={{ margin: '0 0 16px 0', fontSize: '14px', lineHeight: '1.6' }}>
                            Join us for <strong>24 hours</strong> of hacking, learning, and building at DePaul University.
                        </p>
                        <div style={{ 
                            marginBottom: '20px', 
                            padding: '10px 12px', 
                            background: '#f8f8f8', 
                            border: '1px inset #808080', 
                            borderRadius: '2px'
                        }}>
                            <span style={{ fontSize: '11px', color: '#333' }}>
                                Not a DePaul student? <strong>No problem.</strong> All university <strong>and</strong> graduate students are welcome!
                            </span>
                        </div>
                        <div style={{ borderTop: '1px solid #ccc', padding: '16px 0 0 0' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>• <strong>Network</strong> with peers and industry professionals</p>
                            <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>• <strong>Topic talks</strong> throughout the event</p>
                            <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>• <strong>Prizes</strong> for top 3 teams, judged by club officers & industry pros</p>
                            <p style={{ margin: 0, fontSize: '13px' }}>• <strong>Free food</strong> provided throughout the event</p>
                        </div>
                    </div>
                </div>
            )}

            {showForm ? (
                <div className="window" style={{ marginTop: showHeader ? '-2px' : (showAbout ? '-2px' : '20px'), marginBottom: '40px', pointerEvents: 'auto', position: 'relative' }}>
                    <div className="title-bar">
                        <button 
                            aria-label="Close" 
                            className="close"
                            onClick={() => setShowForm(false)}
                        ></button>
                        <h1 className="title">Registration Form</h1>
                        <button aria-label="Resize" disabled className="hidden"></button>
                    </div>
                    <div className="separator"></div>
                    <div className="window-pane" style={{ padding: '20px' }}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <Controller
                                name="fullName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field style={{ marginBottom: '16px' }}>
                                        <FieldLabel htmlFor="fullName" required>Full Name</FieldLabel>
                                        <Input {...field} id="fullName" placeholder="John Doe" style={{ width: '100%' }} />
                                        <FieldError message={fieldState.error?.message} />
                                    </Field>
                                )}
                            />

                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field style={{ marginBottom: '16px' }}>
                                        <FieldLabel htmlFor="email" required>University Email</FieldLabel>
                                        <Input {...field} id="email" type="email" placeholder="student@university.edu" style={{ width: '100%' }} />
                                        <FieldDescription>Valid for ALL .edu addresses—all colleges <strong>and</strong> grad programs welcome!</FieldDescription>
                                        <FieldError message={fieldState.error?.message} />
                                    </Field>
                                )}
                            />

                            <Controller
                                name="gradYear"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field style={{ marginBottom: '16px' }}>
                                        <FieldLabel htmlFor="gradYear" required>Graduation Year</FieldLabel>
                                        <Select {...field} id="gradYear" style={{ width: '100%' }}>
                                            <option value="">Select year...</option>
                                            {GRAD_YEAR_OPTIONS.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </Select>
                                        <FieldError message={fieldState.error?.message} />
                                    </Field>
                                )}
                            />

                            <Controller
                                name="track"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field style={{ marginBottom: '16px' }}>
                                        <FieldLabel required>Hackathon Track</FieldLabel>
                                        <div style={{ marginTop: '8px' }}>
                                            {TRACK_OPTIONS.map((track, idx) => (
                                                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '8px', paddingLeft: '4px' }}>
                                                    <input 
                                                        type="radio"
                                                        id={`track-${idx}`}
                                                        name={field.name}
                                                        value={track.value}
                                                        checked={field.value === track.value}
                                                        onChange={() => field.onChange(track.value)}
                                                        onBlur={field.onBlur}
                                                        ref={idx === 0 ? field.ref : undefined}
                                                        style={{ marginTop: '3px', flexShrink: 0 }}
                                                    />
                                                    <label htmlFor={`track-${idx}`} style={{ cursor: 'pointer' }}>
                                                        <span style={{ fontSize: '13px', fontWeight: '500', display: 'block' }}>{track.title}</span>
                                                        <span style={{ fontSize: '11px', color: '#666', display: 'block', marginTop: '2px' }}>{track.description}</span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        <FieldError message={fieldState.error?.message} />
                                    </Field>
                                )}
                            />

                            <Controller
                                name="teamStatus"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field style={{ marginBottom: '16px' }}>
                                        <FieldLabel required>Team Status</FieldLabel>
                                        <FieldDescription>Teams must have a minimum of 2 members.</FieldDescription>
                                        <div style={{ marginTop: '8px' }}>
                                            {TEAM_STATUS_OPTIONS.map((status, idx) => (
                                                <RadioItem
                                                    key={idx}
                                                    name={field.name}
                                                    value={status}
                                                    label={status}
                                                    checked={field.value === status}
                                                    onChange={() => field.onChange(status)}
                                                    onBlur={field.onBlur}
                                                    ref={idx === 0 ? field.ref : undefined}
                                                />
                                            ))}
                                        </div>
                                        <FieldError message={fieldState.error?.message} />
                                    </Field>
                                )}
                            />

                            <Field style={{ marginBottom: '16px' }}>
                                <FieldLabel>Teammate Details</FieldLabel>
                                <FieldDescription>Add up to 5 teammates (max 6 per team)</FieldDescription>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '8px', marginTop: '8px', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '500', color: '#666' }}>Full Name</span>
                                    <span style={{ fontSize: '11px', fontWeight: '500', color: '#666' }}>Email</span>
                                </div>
                                
                                {teammates.map((teammate, idx) => (
                                    <div key={idx} style={{ marginBottom: '6px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '8px' }}>
                                            <input
                                                type="text"
                                                placeholder={`Teammate ${idx + 1}`}
                                                value={teammate.name}
                                                onChange={(e) => updateTeammate(idx, 'name', e.target.value)}
                                                onBlur={() => handleTeammateBlur(idx, 'name')}
                                                style={{ 
                                                    width: '100%', 
                                                    padding: '3px 5px', 
                                                    fontSize: '12px', 
                                                    border: teammate.nameError ? '1px solid red' : '1px solid #000', 
                                                    fontFamily: 'inherit', 
                                                    boxSizing: 'border-box' 
                                                }}
                                            />
                                            <input
                                                type="email"
                                                placeholder={`email${idx + 1}@university.edu`}
                                                value={teammate.email}
                                                onChange={(e) => updateTeammate(idx, 'email', e.target.value)}
                                                onBlur={() => handleTeammateBlur(idx, 'email')}
                                                style={{ width: '100%', padding: '3px 5px', fontSize: '12px', border: '1px solid #000', fontFamily: 'inherit', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                        {teammate.nameError && (
                                            <span style={{ fontSize: '10px', color: 'red', marginTop: '2px', display: 'block' }}>
                                                {teammate.nameError}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </Field>

                            <Controller
                                name="dietaryRestrictions"
                                control={form.control}
                                render={({ field }) => (
                                    <Field style={{ marginBottom: '20px' }}>
                                        <FieldLabel>Dietary Restrictions</FieldLabel>
                                        <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                                            {DIETARY_OPTIONS.map((diet, idx) => (
                                                <CheckboxItem
                                                    key={idx}
                                                    name={field.name}
                                                    value={diet}
                                                    label={diet}
                                                    checked={field.value?.includes(diet) || false}
                                                    onChange={(e) => {
                                                        const newValue = e.target.checked
                                                            ? [...(field.value || []), diet]
                                                            : (field.value || []).filter(v => v !== diet);
                                                        field.onChange(newValue);
                                                    }}
                                                    onBlur={field.onBlur}
                                                />
                                            ))}
                                        </div>
                                    </Field>
                                )}
                            />

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <Button type="submit" isLoading={submitting}>Register Now</Button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                showNotice && (
                    <div className="window" style={{ marginTop: showHeader ? '-2px' : (showAbout ? '-2px' : '20px'), marginBottom: '40px', pointerEvents: 'auto' }}>
                        <div className="title-bar">
                            <button 
                                aria-label="Close" 
                                className="close"
                                onClick={() => setShowNotice(false)}
                            ></button>
                            <h1 className="title">notice.txt</h1>
                            <button aria-label="Resize" disabled className="hidden"></button>
                        </div>
                        <div className="separator"></div>
                        <div style={{ padding: '30px', textAlign: 'center', background: '#fff' }}>
                            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                                Please refresh the page to get the form again.
                            </p>
                        </div>
                    </div>
                )
            )}
        </div>
        </>
    );
};

export default RegistrationForm;
