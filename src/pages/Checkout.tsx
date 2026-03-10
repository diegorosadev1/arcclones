/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle, CreditCard, Truck, MapPin, User, ShieldCheck, ArrowRight, Wallet, QrCode, ReceiptText } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

type Step = 'identification' | 'shipping' | 'payment' | 'review' | 'success';

export function Checkout() {
  const { cart, user, clearCart, addNotification } = useStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('identification');
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    cpf: '',
    phone: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    paymentMethod: 'credit_card',
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.promoPrice || item.price) * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 45.00;
  const total = subtotal + shipping;

  const steps: { id: Step; label: string; icon: any }[] = [
    { id: 'identification', label: 'Identificação', icon: User },
    { id: 'shipping', label: 'Entrega', icon: MapPin },
    { id: 'payment', label: 'Pagamento', icon: CreditCard },
    { id: 'review', label: 'Revisão', icon: ReceiptText },
  ];

  const handleNext = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    } else if (currentStep === 'review') {
      // Simulate order placement
      setCurrentStep('success');
      clearCart();
      addNotification('Pedido realizado com sucesso!', 'success');
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    } else {
      navigate('/cart');
    }
  };

  if (currentStep === 'success') {
    return (
      <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle size={64} />
        </motion.div>
        <div className="space-y-4">
          <h2 className="text-4xl font-display font-bold">Pedido Confirmado!</h2>
          <p className="text-zinc-500 max-w-md mx-auto">Obrigado pela sua compra, {formData.name.split(' ')[0]}. Enviamos os detalhes do pedido para o seu e-mail.</p>
          <p className="text-xs text-zinc-600">Número do pedido: #LX-78291-2026</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/account" className="btn-outline px-10 py-4">Ver Meus Pedidos</Link>
          <Link to="/" className="btn-primary px-10 py-4">Voltar para a Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Main Checkout Flow */}
        <div className="flex-grow space-y-12">
          {/* Progress Bar */}
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > i;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                      isActive ? "bg-accent border-accent text-white scale-110 shadow-[0_0_15px_rgba(225,29,72,0.4)]" :
                      isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                    )}
                  >
                    {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                  </div>
                  <span className={clsx(
                    "text-[10px] font-bold uppercase tracking-widest",
                    isActive ? "text-accent" : isCompleted ? "text-emerald-500" : "text-zinc-500"
                  )}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="glass-card p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {currentStep === 'identification' && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-display font-bold">Identificação</h2>
                      <p className="text-zinc-500">Precisamos de alguns dados básicos para processar seu pedido.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nome Completo</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                          placeholder="Ex: João Silva"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">E-mail</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">CPF</label>
                        <input
                          type="text"
                          value={formData.cpf}
                          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                          placeholder="000.000.000-00"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Telefone</label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 'shipping' && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-display font-bold">Endereço de Entrega</h2>
                      <p className="text-zinc-500">Onde você deseja receber seus itens de luxo?</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">CEP</label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                          placeholder="00000-000"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Endereço</label>
                        <input
                          type="text"
                          value={formData.street}
                          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                          placeholder="Rua, Avenida, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Número</label>
                        <input
                          type="text"
                          value={formData.number}
                          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                          placeholder="123"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Complemento</label>
                        <input
                          type="text"
                          value={formData.complement}
                          onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                          placeholder="Apto, Bloco, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Cidade</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                          placeholder="São Paulo"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 'payment' && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-display font-bold">Forma de Pagamento</h2>
                      <p className="text-zinc-500">Escolha como deseja realizar o pagamento seguro.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: 'credit_card', label: 'Cartão de Crédito', icon: CreditCard, desc: 'Até 10x sem juros' },
                        { id: 'pix', label: 'PIX', icon: QrCode, desc: 'Aprovação imediata' },
                        { id: 'boleto', label: 'Boleto Bancário', icon: ReceiptText, desc: 'Até 3 dias úteis' },
                      ].map(method => (
                        <button
                          key={method.id}
                          onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                          className={clsx(
                            "p-6 rounded-2xl border-2 transition-all duration-300 text-left space-y-4",
                            formData.paymentMethod === method.id ? "bg-accent/5 border-accent shadow-[0_0_15px_rgba(225,29,72,0.1)]" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                          )}
                        >
                          <div className={clsx(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            formData.paymentMethod === method.id ? "bg-accent text-white" : "bg-zinc-800 text-zinc-400"
                          )}>
                            <method.icon size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{method.label}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{method.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {formData.paymentMethod === 'credit_card' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-6"
                      >
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Número do Cartão</label>
                          <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors" placeholder="0000 0000 0000 0000" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Validade</label>
                            <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors" placeholder="MM/AA" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">CVV</label>
                            <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors" placeholder="123" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {currentStep === 'review' && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-display font-bold">Revisão do Pedido</h2>
                      <p className="text-zinc-500">Confira se tudo está correto antes de finalizar.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Entrega</h4>
                            <button onClick={() => setCurrentStep('shipping')} className="text-accent text-xs font-bold hover:underline">Editar</button>
                          </div>
                          <p className="text-sm text-zinc-300">{formData.street}, {formData.number} {formData.complement && `- ${formData.complement}`}</p>
                          <p className="text-sm text-zinc-300">{formData.city}, {formData.state} - {formData.zipCode}</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Pagamento</h4>
                            <button onClick={() => setCurrentStep('payment')} className="text-accent text-xs font-bold hover:underline">Editar</button>
                          </div>
                          <div className="flex items-center gap-3">
                            <CreditCard size={18} className="text-accent" />
                            <p className="text-sm text-zinc-300">
                              {formData.paymentMethod === 'credit_card' ? 'Cartão de Crédito' : 
                               formData.paymentMethod === 'pix' ? 'PIX' : 'Boleto Bancário'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Itens do Pedido</h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {cart.map(item => (
                            <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-zinc-900/30 border border-zinc-800">
                              <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                              <div className="flex-grow">
                                <p className="text-sm font-bold truncate">{item.name}</p>
                                <p className="text-xs text-zinc-500">{item.quantity}x R$ {(item.promoPrice || item.price).toLocaleString()}</p>
                              </div>
                              <p className="text-sm font-bold">R$ {((item.promoPrice || item.price) * item.quantity).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-8 border-t border-zinc-800">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
                  >
                    <ChevronLeft size={18} /> Voltar
                  </button>
                  <button
                    onClick={handleNext}
                    className="btn-primary px-12 py-4 uppercase tracking-widest text-sm font-bold"
                  >
                    {currentStep === 'review' ? 'Finalizar Pedido' : 'Próximo Passo'} <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="glass-card p-8 space-y-8 sticky top-32">
            <h3 className="font-display font-bold text-2xl">Resumo do Pedido</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Subtotal ({cart.length} itens)</span>
                <span className="text-white font-medium">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Frete</span>
                <span className={shipping === 0 ? "text-emerald-500 font-bold" : "text-white font-medium"}>
                  {shipping === 0 ? 'GRÁTIS' : `R$ ${shipping.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </span>
              </div>
              <div className="h-px bg-zinc-800" />
              <div className="flex justify-between text-xl font-bold text-white">
                <span>Total</span>
                <span className="text-accent">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>Compra Segura & Criptografada</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <Truck size={16} className="text-accent" />
                <span>Entrega VIP com Seguro Total</span>
              </div>
            </div>

            <div className="pt-4 text-center">
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Precisa de ajuda com o pagamento?</p>
              <p className="text-xs text-accent font-bold mt-1 cursor-pointer hover:underline">Falar com Consultor LUXE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
