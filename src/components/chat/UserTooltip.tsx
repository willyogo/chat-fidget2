import { useState, useRef, useEffect } from 'react';

type UserTooltipProps = {
  address: string;
  farcasterUsername: string | null;
  children: React.ReactNode;
};

export function UserTooltip({ address, farcasterUsername, children }: UserTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Position the tooltip when it becomes visible
  useEffect(() => {
    if (!showTooltip || !triggerRef.current || !tooltipRef.current) return;

    const positionTooltip = () => {
      const trigger = triggerRef.current?.getBoundingClientRect();
      const tooltip = tooltipRef.current;
      if (!trigger || !tooltip) return;

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Get tooltip dimensions after it's rendered
      const tooltipRect = tooltip.getBoundingClientRect();
      const tooltipHeight = tooltipRect.height;
      const tooltipWidth = tooltipRect.width;

      // Calculate available space
      const spaceBelow = viewportHeight - trigger.bottom;
      const spaceRight = viewportWidth - trigger.left;

      // Reset styles
      tooltip.style.top = '';
      tooltip.style.bottom = '';
      tooltip.style.left = '';
      tooltip.style.right = '';

      // Position vertically
      if (spaceBelow >= tooltipHeight) {
        tooltip.style.top = `${trigger.bottom + window.scrollY}px`;
        tooltip.style.bottom = 'auto';
      } else {
        tooltip.style.bottom = `${viewportHeight - trigger.top + window.scrollY}px`;
        tooltip.style.top = 'auto';
      }

      // Position horizontally
      if (spaceRight >= tooltipWidth) {
        tooltip.style.left = `${trigger.left}px`;
        tooltip.style.right = 'auto';
      } else {
        tooltip.style.right = `${viewportWidth - trigger.right}px`;
        tooltip.style.left = 'auto';
      }
    };

    // Initial positioning
    positionTooltip();

    // Update position on scroll or resize
    window.addEventListener('scroll', positionTooltip, true);
    window.addEventListener('resize', positionTooltip);

    return () => {
      window.removeEventListener('scroll', positionTooltip, true);
      window.removeEventListener('resize', positionTooltip);
    };
  }, [showTooltip]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const tooltipEl = tooltipRef.current;
    const relatedTarget = e.relatedTarget as HTMLElement;
    
    // Don't hide if moving to the tooltip content
    if (tooltipEl?.contains(relatedTarget)) {
      return;
    }

    // Add a delay before hiding for better UX
    timeoutRef.current = window.setTimeout(() => {
      setShowTooltip(false);
    }, 300);
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={triggerRef}
        className="cursor-pointer"
      >
        {children}
      </div>

      {showTooltip && (
        <div 
          ref={tooltipRef}
          className="fixed bg-white rounded-lg shadow-lg border min-w-[200px] z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="py-1">
            <a
              href={`https://basescan.org/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <img 
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADjUlEQVR4AbVWA5AdSxTt2DZnZu3d6fdZ/L/47VX3fNuFbxsxGu/FSSm1KMa2bdu2k5fbVZlVr/plcqvO4A7Oxbk9g+prvVLe6GTlUGK5ZKSN6SoH07MOJjdhfwNw1HHJPDjvb+WQZ7plvd4KBWV2DsmxMJ3guPQiEEXrBZceg/1fVsjrETNxl7Tc1vCiAZDZtXoT6zhph8iXaWm5TY3InSwv+V6ZowHgDiQxw8ko7FYvcsstfBx6eUI9HCRsl27qnZ3bq/Z+ZxamBEqugazvnZbbsQaxvdXewd76gEk12JiUIpTbSO87piwIAsulw+y03O7d3dwuMI5dbZd8DP7bFe65Db6Cyn3PyscxqV0DuRmX/UYSqmC9H89tAYI+UqUKu9SUlZcf04kBlfhGb+wlVGqt/URzSO6g3grvQ6QsHsoEjstmRN4JC5MfLEw/VYCSSkjilkkAjkvX3suevGWaqVpcNBFjOseoApB0xwTaVolvgnEAOeQtTcQuLa4xAEwO6OsCmeerf0ONZC45Zrt0swKc7y8PgL5pFIBegf19HyJxfgAXaiBfq9YG/0UJCU83A1/J/VeAnIhzX38Igf3222+NkRJPDWUeUw3J51oAZhU46WSTR5S/qCi3kRDsT6QeqmHtHq2TFH4ecwtcusPC+am+XzD2tRR8FVIleZABqNaBn/cMFXb2fVLKPCC/ITmfpR5cHngAmv3WsCxzMexZIL8IiIaFiCgNhB98AD758FyfXAHOP0Lqw2AeQI0iPNo3k3TQ8v/tt4ac828EZzfLyflN8KUi9X3WR9E8APUz2iuL9q7qZ4x1Cgte5BOXgfOVyDdFZhjAi6gOi0ajDYD8RSnYfo1cQbJ3kG9x2flJ8OLzVdaBiJZliDwJI/UGCoWa1EYeDocTocSlQHSrOnLATih/6yrZeS/Y2FtmY7IGdDHZyi5wkaENGTKkrxBsIPT6kk7qA4KSw19FQZkSmBBDQ9DT0b7CawXnYfWMOZOebTeY44/gpUsBd2on9iHmFg0a1CImwqKioqbQtxzB2LcgrEWA6/Ui9SHF3EGDBnWsN+HgwYPbCyE8yPI/GKPpgvMTvqgMcQt0IYqKDDOfC5/KMOfvSs6OGZP64GwrvON5NZIoVpNSdgXh/Aol31XPCtyCam1S+ohEIi1RUAYaaATznQ3BfCYlH6t0IARfBVkugeNpILCRkrEvoG1ZJhnfBfLRfkCN/mQPAAAAAElFTkSuQmCC"
                alt="BaseScan"
                className="w-4 h-4"
              />
              View on BaseScan
            </a>

            {farcasterUsername && (
              <>
                <a
                  href={`https://warpcast.com/${farcasterUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <img 
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAMFBMVEVGK5FHcExDLYxELJJCLoxDL4hHK5NFLJL//f5DKoo3GYEsCHjFvNOglL/c1epvXamoqKe6AAAABnRSTlOAAEdrior+Vk3zAAABB0lEQVQ4jaWTi46EIAxFWdjppTDq///t0hYF7GRnkmlijfbQh96GnzcWPgViWC3FBYgA3Q1pAL9wAAh4nEAClADZZeFmsQN2frrQATIgQl/0o2cGQSgqkIiuCsyYuwgKhHFy7lJsAESl1mKeIV57mIDyzDlX8c9Ss/gFAPhob0lCuVJzB98ASGyTUD625lwJqnvLK6G8tTp7dUCRoDSSd4F8BuY8GbMHpEY7br7CAdBBzzaKz0B06AjmfYn2VCRUzNMC9B9RdDz7mC8BHYVZ73gNSNxibFOkLpghAUl9/Wxw7JKb1EgzgK7JaBLzgkn/yF6Ax1icBJ41qwLhuK5euu3eunrfbPcfZQQUHa9wuUMAAAAASUVORK5CYII="
                    alt="Warpcast"
                    className="w-4 h-4"
                  />
                  View on Warpcast
                </a>

                <a
                  href={`https://www.nounspace.com/s/${farcasterUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <img 
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAA10lEQVR4AWJwL/ChKwa0U95GDIQAEKxAmaLv6KugCQr4FuiAPuiDkAqISdEFN5o3WHkDM/v2hsUP4RC2MYQoMxBEggUooHfMzKsCC5FA5ISxEd2ZdzlhYMADR3yD0LDnplfoGZhW30RF6MujRCGKBW6FBbFRGIDpFcYCp7KQpIUhJwzkBCbebUIoU0PKfARhJ3RpYTpsEsIlUYFa92ZXh02NwnVIM8JzRahvERpgM2G92rSmJmSO8NueOze+ac+T2tFG5Ir1USeYF3zXCdQK8f7DewiHcAgvZLfm1PG+WmUAAAAASUVORK5CYII="
                    alt="nounspace"
                    className="w-4 h-4"
                  />
                  View on nounspace
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}