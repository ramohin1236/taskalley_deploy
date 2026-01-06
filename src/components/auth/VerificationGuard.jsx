"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/useAuth";

const VerificationGuard = ({ children }) => {
    const {
        isAuthenticated,
        isAuthLoading,
        isProfileLoading,
        profileData,
        user
    } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isAuthLoading || isProfileLoading) return;

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (isAuthenticated && user?.role !== 'admin') {
            const data = profileData?.data;
            if (!data) return;

            // Common verification
            if (!data.isAddressProvided) {
                if (pathname !== "/verify") {
                    router.push("/verify");
                    return;
                }
            }

            // Provider specific verifications
            if (user?.role === 'provider') {
                if (!data.isBankNumberVerified) {
                    if (pathname !== "/bank_verification") {
                        router.push("/bank_verification");
                        return;
                    }
                }

                if (!data.isIdentificationDocumentVerified) {
                    if (pathname !== "/id_card_verify") {
                        router.push("/id_card_verify");
                        return;
                    }
                }
            }
        }
    }, [isAuthenticated, profileData, isAuthLoading, isProfileLoading, pathname, router, user]);

    if (isAuthLoading || isProfileLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#115E59]"></div>
            </div>
        );
    }

    return <>{children}</>;
};

export default VerificationGuard;
