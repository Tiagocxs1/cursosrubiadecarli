'use client';

import React, { useState } from 'react';
import { getTrackingData, trackFormStart, trackFormSubmit } from '@/lib/tracking';
import { motion } from 'framer-motion';
import { Send, Mail, User, Phone, CheckCircle, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface LeadCaptureFormProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onSuccess?: () => void;
  showWhatsApp?: boolean;
  showNewsletter?: boolean;
  variant?: 'default' | 'compact' | 'full';
  className?: string;
}

export default function LeadCaptureForm({
  title = "Fale com nossa equipe",
  subtitle = "Deixe seus dados e entraremos em contato para entender se nossos cursos são o próximo passo ideal para sua carreira.",
  buttonText = "Falar com a Equipe",
  onSuccess,
  showWhatsApp = true,
  showNewsletter = true,
  variant = 'default',
  className = "",
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    newsletter: false,
    whatsapp: false,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!formData.phone.trim()) newErrors.phone = 'WhatsApp é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setStatus('submitting');
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.name,
          whatsapp: formData.phone,
          email: formData.email,
          mensagem: formData.message,
          newsletter: formData.newsletter,
          receberDicas: formData.newsletter ? 'sim' : 'não',
          contatoWhatsapp: formData.whatsapp,
          origem: 'site - formulário lead capture',
          fonte: 'lead_capture',
          ...getTrackingData(),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) throw new Error('Não foi possível enviar a solicitação.');

      trackFormSubmit('lead_capture');
      setStatus('success');
      if (onSuccess) onSuccess();
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          newsletter: false,
          whatsapp: false,
        });
        setStatus('idle');
      }, 3000);
      
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-3xl p-8 border border-[#D4AF37]/20 shadow-xl ${className}`}
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">Solicitação Enviada!</h3>
          <p className="text-[#4A3F35] mb-4">Verifique seu WhatsApp para conversar com nossa equipe.</p>
          <p className="text-sm text-[#D4AF37] font-medium">Entraremos em contato em breve!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-3xl p-8 border border-[#D4AF37]/20 shadow-xl ${className}`}
    >
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">{title}</h3>
          <p className="text-[#4A3F35] font-light">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} onFocusCapture={() => trackFormStart('lead_capture')} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#4A3F35] mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Nome Completo
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={handleChange}
                className={`border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] ${
                  errors.name ? 'border-red-500' : ''
                }`}
                disabled={status === 'submitting'}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#4A3F35] mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                E-mail
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                className={`border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] ${
                  errors.email ? 'border-red-500' : ''
                }`}
                disabled={status === 'submitting'}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[#4A3F35] mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              WhatsApp (com DDD)
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(XX) 9XXXX-XXXX"
              value={formData.phone}
              onChange={handleChange}
              className={`border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] ${
                errors.phone ? 'border-red-500' : ''
              }`}
              disabled={status === 'submitting'}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {variant === 'full' && (
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#4A3F35] mb-2">
                Mensagem
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Conte-nos um pouco sobre seus objetivos..."
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                disabled={status === 'submitting'}
              />
            </div>
          )}

          {showNewsletter && (
            <div className="flex items-start gap-3 p-4 bg-[#FAF9F8] rounded-xl">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
                className="mt-1 w-5 h-5 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37] focus:ring-2"
              />
              <label htmlFor="newsletter" className="text-sm text-[#4A3F35]">
                Quero receber dicas exclusivas e atualizações sobre novos cursos e promoções.
              </label>
            </div>
          )}

          {showWhatsApp && (
            <div className="flex items-start gap-3 p-4 bg-[#FAF9F8] rounded-xl">
              <input
                type="checkbox"
                id="whatsapp"
                name="whatsapp"
                checked={formData.whatsapp}
                onChange={handleChange}
                className="mt-1 w-5 h-5 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37] focus:ring-2"
              />
              <label htmlFor="whatsapp" className="text-sm text-[#4A3F35]">
                Desejo ser contactado via WhatsApp para agendamento e suporte.
              </label>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <Button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full md:w-auto px-8 py-3 bg-[#D4AF37] hover:bg-[#B8952E] text-white rounded-xl font-semibold tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {status === 'submitting' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {buttonText}
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Shield className="w-3 h-3" />
            Seus dados estão 100% seguros e protegidos
          </div>
        </form>
      </div>
    </motion.div>
  );
}