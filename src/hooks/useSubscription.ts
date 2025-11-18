import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSubscription = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkSubscription();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsPremium(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking subscription:', error);
        setIsPremium(false);
      } else if (data) {
        const isActive = data.tier === 'premium' && 
                        (!data.expires_at || new Date(data.expires_at) > new Date());
        setIsPremium(isActive);
      } else {
        setIsPremium(false);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  const createFreeSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          tier: 'free'
        });

      if (error && error.code !== '23505') { // 23505 = unique violation (already exists)
        console.error('Error creating subscription:', error);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const upgradeToPremium = async (abacatePaySubscriptionId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para assinar.",
          variant: "destructive"
        });
        return false;
      }

      // Upsert subscription
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          tier: 'premium',
          abacate_pay_subscription_id: abacatePaySubscriptionId,
          expires_at: null // null = never expires (until cancelled)
        });

      if (error) {
        console.error('Error upgrading subscription:', error);
        toast({
          title: "Erro",
          description: "Erro ao ativar premium. Tente novamente.",
          variant: "destructive"
        });
        return false;
      }

      await checkSubscription();
      toast({
        title: "🎉 Premium Ativado!",
        description: "Agora você tem acesso a todos os recursos premium!"
      });
      return true;
    } catch (err) {
      console.error('Unexpected error:', err);
      return false;
    }
  };

  return {
    isPremium,
    loading,
    createFreeSubscription,
    upgradeToPremium,
    refreshSubscription: checkSubscription
  };
};
