import Speak from "@/features/chat-interface/components/Speak";
import AppSidebar from "@/features/shared/components/sidebar";
import History from "@/features/shared/components/history";
import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClientDynamic } from "@/features/shared/lib/queryClientDynamic";
import { ConversationsServer } from "@/features/chat-interface/utils/chat-queries";
import { getAuth } from "@/features/auth/utils/auth";

const appName = "JhairGPT";

const Page = async () => {
  const cookieStore = cookies();
  const queryClient = getQueryClientDynamic();

  const { authCookies } = await getAuth(cookieStore);

  await queryClient.prefetchQuery(ConversationsServer(authCookies));

  return (
    <>
      <AppSidebar>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <History />
        </HydrationBoundary>
      </AppSidebar>
      <Speak>
        <main className="flex-grow flex flex-col justify-center">
          <div className="flex flex-col justify-center items-center max-w-4xl w-full text-center mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white m-0 max-w-fit overflow-hidden whitespace-nowrap animation">
              Welcome to{` ${appName}`}
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Your copilot for all
            </p>
          </div>
        </main>
      </Speak>
    </>
  );
};

export default Page;
